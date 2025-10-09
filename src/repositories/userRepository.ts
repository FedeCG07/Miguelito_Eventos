import { User } from "@prisma/client";
import { db } from "../db/db";

export class UserRepository {
    async createUser(firstName: string, lastName: string, username: string, DNI: string, email: string, password: string) {
        const newUser = await db.user.create({
            data: {
                firstName,
                lastName,
                username,
                DNI,
                email,
                password
            }
        })

        if (!newUser) throw new Error;

        return newUser;
    }

    async getUserById(id: string) {
        const user = await db.user.findFirst({
            where: {
                id
            }
        })

        if (!user) throw new Error;

        return user;
    }

    async getUserByEmail(email: string) {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (!user) throw new Error;

        return user;
    }

    async getUserByUsername(username: string) {
        const user = await db.user.findUnique({
            where: {
                username
            }
        })

        if (!user) throw new Error;

        return user;
    }
    
    async increaseBalance(id: string, amount: number) {
        const updated_user = await db.user.updateMany({
            where: {
                id
            },
            data: {
                balance: {
                    increment: amount
                } 
            }
        })

        if (updated_user.count === 0) throw new Error;

        return updated_user;
    }

    async decreaseBalance(id: string, amount: number) {
        const updated_user = await db.user.updateMany({
            where: {
                id
            },
            data: {
                balance: {
                    decrement: amount
                } 
            }
        })

        if (updated_user.count === 0) throw new Error;

        return updated_user;
    }
}