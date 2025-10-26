import { Event } from "@prisma/client";
import { db } from "../db/db";

export class EventRepositroy {
    async createEvent(title: string, date: Date, shortDescription: string, longDescription: string, address: string, price: number, maximumCapacity: number, category: number, userCreatorId: string) {
        const new_event = await db.event.create ({
            data: {
                title,
                date,
                shortDescription,
                longDescription,
                address,
                price,
                maximumCapacity,
                category,
                userCreatorId
            }
        })
        
        if (!new_event) throw new Error;

        return new_event;
    }
    
    async cancelEvent(id: string) {
        const cancelled_event = await db.event.update({
            where: {
                id
            },
            data: {
                cancelled: true
            }
        })


        return cancelled_event;
    }

    async uncancelEvent(id: string) {
        const uncancelled_event = await db.event.updateMany({
            where: {
                id
            },
            data: {
                cancelled: false
            }
        })

        if (uncancelled_event.count === 0) throw new Error;

        return uncancelled_event;
    }

    async increaseAssistingUsers(id: string, amount: number) {
        const updated_event = await db.event.updateMany({
            where: {
                id
            },
            data: {
                assistingUsers: {
                    increment: amount
                }
            }
        })

        if (updated_event.count === 0) throw new Error;

        return updated_event;
    }

    async decreaseAssistingUsers(id: string, amount: number) {
        const updated_event = await db.event.updateMany({
            where: {
                id
            },
            data: {
                assistingUsers: {
                    decrement: amount
                }
            }
        })

        if (updated_event.count === 0) throw new Error;

        return updated_event;
    }

    async getEventById(id: string) {
        const event = await db.event.findUnique({
            where: {
                id
            }
        })

        if (!event) throw new Error;

        return event;
    }

    async getAllEvents() {
        return await db.event.findMany({
            where: {
                date: {
                    gt: new Date()
                },
                cancelled: false
            }
        });
    }

    async getFreeEvents() {
        try {
            const events = await db.event.findMany({
                where: {
                    price: 0,
                    date: {
                        gt: new Date()
                    },
                    cancelled: false
                }
            })

            if (!events) throw new Error;

            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventsByCategory(category: number) {
        try {
            const events = await db.event.findMany({
                where: {
                    category,
                    date: {
                        gt: new Date()
                    },
                    cancelled: false
                }
            })

            if (!events) throw new Error;

            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventsByCreator(userCreatorId: string) {
        try {
            const events = await db.event.findMany({
                where: {
                    userCreatorId
                },
                orderBy: [
                    { cancelled: 'asc' },
                    { date: 'desc' }
                ]
            })

            if (!events) throw new Error;

            return events;
        } catch (error) {
            throw error;
        }
    }
}