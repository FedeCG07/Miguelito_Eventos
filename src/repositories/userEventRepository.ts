import { UserEvent } from "@prisma/client";
import { db } from "../db/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserEventRepository {
    async createUserEvent(eventId: string, userId: string, reservationsMade: number) {
        const new_user_event = await db.userEvent.create({
            data: {
                eventId,
                userId,
                reservationsMade
            }
        })

        if (!new_user_event) throw new Error;

        return new_user_event;
    }

    async increaseReservationsCancelled(eventId: string, userId: string, amount: number) {
        const updated_user_event = await db.userEvent.updateMany({
            where: {
                eventId,
                userId
            }, 
            data: {
                reservationsCancelled: {
                    increment: amount
                }
            }
        })

        if (updated_user_event.count === 0) throw new Error;

        return updated_user_event;
    }

    async getUserEventByUserId(userId: string) {
        const user_events: UserEvent[] = await prisma.$queryRaw`
        select * from userevent
        where userevent.userid = ${userId}
        and reservationsMade - reservationsCancelled = 0;
        `

        if (user_events.length === 0) throw new Error;

        return user_events;
    }

    async getUserEventByEventId(eventId: string) {
        const user_events: UserEvent[] = await prisma.$queryRaw`
        select * from userevent
        where userevent.eventid = ${eventId}
        and reservationsMade - reservationsCancelled = 0;
        `

        if (user_events.length === 0) throw new Error;

        return user_events;
    }
}