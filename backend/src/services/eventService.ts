import { EventRepositroy } from "../repositories/eventRepository";
import { UserEventRepository } from "../repositories/userEventRepository";
import { UserRepository } from "../repositories/userRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { Event as PrismaEvent, UserEvent } from '@prisma/client';


const eventRepository = new EventRepositroy();
const userEventRepository = new UserEventRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();

export class EventService {
    async createEvent(title: string, date: Date, shortDescription: string, longDescription: string, address: string, price: number, maximumCapacity: number, category: number, userCreatorId: string) {
        try {
            const new_event = await eventRepository.createEvent(title, date, shortDescription, longDescription, address, price, maximumCapacity, category, userCreatorId);

            const event_id = new_event.id;
            await userEventRepository.createUserEvent(event_id, userCreatorId, 1);
            await eventRepository.increaseAssistingUsers(event_id, 1);

            return new_event;
        } catch (error) {
            throw error;
        }
    }

    async joinEvent(eventId: string, userId: string, reservations: number) {
        try {
            const user_event = await userEventRepository.getUserEventByUserIdAndEventId(eventId, userId);

            if (user_event.length != 0) throw new Error('Already joined this event'); //already joined the event
            
            const event = await eventRepository.getEventById(eventId);
            const price = event.price;

            const maximumCapacity = event.maximumCapacity;
            const assistingUsers = event.assistingUsers;
            if (assistingUsers + reservations > maximumCapacity) throw new Error;

            if (price != 0) {
                const user = await userRepository.getUserById(userId);

                const balance = user.balance;
                if (!(balance >= price * reservations)) throw new Error;

                await userRepository.decreaseBalance(userId, price * reservations);
            }

            const new_user_event = await userEventRepository.createUserEvent(eventId, userId, reservations);
            await eventRepository.increaseAssistingUsers(eventId, reservations);

            return new_user_event;
        } catch (error) {
            throw error;
        }
    }

    async cancelReservations(eventId: string, userId: string, amount: number) {
        try {
            const event = await eventRepository.getEventById(eventId);

            if (event.userCreatorId == userId) throw new Error;

            if (event.date < new Date()) throw new Error;

            const price = event.price;
            if (price != 0) throw new Error;

            const user_event = await userEventRepository.getUserEventByUserIdAndEventId(eventId, userId);
            const reservations_made = user_event[0].reservationsMade;
            const reservations_cancelled = user_event[0].reservationsCancelled;
            const total_reservations = reservations_made - reservations_cancelled;
            if (total_reservations - amount < 0) throw new Error;

            const updated_user_event = await userEventRepository.increaseReservationsCancelled(eventId, userId, amount);
            await eventRepository.decreaseAssistingUsers(eventId, amount);

            return updated_user_event;
        } catch (error) {
            throw error;
        }
    }

    async getAllEvents() {
        try {
            const events = await eventRepository.getAllEvents();

            const events_details = await this.mapEventDetails(events);

            return events_details;
        } catch (error) {
            throw error;
        }
    }

    async getFreeEvents() {
        try {
            const events = await eventRepository.getFreeEvents();
            
            const events_details = await this.mapEventDetails(events);

            return events_details;
        } catch (error) {
            throw error;
        }
    }

    async getEventByCategory(category: number) {
        try {
            const events = await eventRepository.getEventsByCategory(category);

            const event_details = await this.mapEventDetails(events);

            return event_details;
        } catch (error) {
            throw error;
        }
    }

    async getEventsJoinedByUser(userId: string) {
        try {
            const user_events = await userEventRepository.getUserEventByUserId(userId);
            const events = await Promise.all(
                user_events.map(async (user_event: any) => {
                    const event = await eventRepository.getEventById(user_event.eventId);
                    return event;
                })
            )

            const event_details = await this.mapEventDetails(events);

            return event_details;
        } catch (error) {
            throw error;
        }
    }

    async getEventAssistingUsers(eventId: string) {
        try {
            const user_events = await userEventRepository.getUserEventByEventId(eventId);
            const users = await Promise.all(
                user_events.map(async (user_event: any) => {
                    const user = await userRepository.getUserById(user_event.userId);
                    return user;
                })
            )

            return users;
        } catch (error) {
            throw error;
        }
    }

    async cancelEvent(eventId: string) {
        try {
            const cancelled_event = await eventRepository.cancelEvent(eventId);
            const users = await userEventRepository.getUserEventByEventId(eventId);
            for (const user of users) {
                if (user.id == cancelled_event.userCreatorId) continue; 
                const ticket_amount = user.reservationsMade - user.reservationsCancelled;
                await userRepository.increaseBalance(user.userId, cancelled_event.price * ticket_amount);
            }

            return cancelled_event;
        } catch (error) {
            throw error;
        }
    }

    async mapEventDetails(events: PrismaEvent[]) {
        const eventsDetails = await Promise.all(
            events.map(async (event: any) => {
                const category = await categoryRepository.getCategory(event.category);
                const creator = await userRepository.getUserById(event.userCreatorId);
                return {
                    id: event.id,
                    title: event.title,
                    date: event.date,
                    shortDescription: event.shortDescription,
                    longDescription: event.longDescription,
                    address: event.address,
                    price: event.price,
                    cancelled: event.cancelled,
                    maximumCapacity: event.maximumCapacity,
                    assistingUsers: event.assistingUsers,
                    categoryId: category.id,
                    category: category.category,
                    creator: creator.username
                }
            })
        )

        return eventsDetails;
    }
}