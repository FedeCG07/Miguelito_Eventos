import { EventRepositroy } from "../repositories/eventRepository";
import { UserEventRepository } from "../repositories/userEventRepository";
import { UserRepository } from "../repositories/userRepository";

const eventRepository = new EventRepositroy();
const userEventRepository = new UserEventRepository();
const userRepository = new UserRepository();

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
            const event = await eventRepository.getEventById(eventId);
            const price = event.price;

            const maximumCapacity = event.maximumCapacity;
            const assistingUsers = event.assistingUsers;
            if (assistingUsers + reservations > maximumCapacity) throw new Error;

            if (price != 0) {
                const user = await userRepository.getUserById(userId);

                const balance = user.balance;
                if (!(balance >= price * reservations)) throw new Error;

                await userRepository.decreaseBalance(eventId, price * reservations)
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

            const price = event.price;
            if (price != 0) throw new Error;

            const user_event = await userEventRepository.getUserEventByUserIdAndEventId(eventId, userId);
            const reservations_made = user_event.reservationsMade;
            const reservations_cancelled = user_event.reservationsCancelled;
            const total_reservations = reservations_made - reservations_cancelled;
            if (total_reservations - amount < 0) throw new Error;

            const updated_user_event = await userEventRepository.increaseReservationsCancelled(eventId, userId, amount);
            await eventRepository.decreaseAssistingUsers(eventId, amount);

            return updated_user_event;
        } catch (error) {
            throw error;
        }
    }
}