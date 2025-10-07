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
        const cancelled_event = await db.event.updateMany({
            where: {
                id
            },
            data: {
                cancelled: true
            }
        })

        if (cancelled_event.count === 0) throw new Error;

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
}