import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthService } from '../services/authService';

const eventService = new EventService();
const authService = new AuthService();

export async function createEvent(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;
        const { title, date, shortDescription, longDescription, address, price, maximumCapacity, category } = req.body;
        const formated_date = new Date(date);
        const int_price = +price;
        const int_maximumCapacity = +maximumCapacity;
        const int_category = +category;

        if (!token) throw new Error;

        const decoded_token = authService.decodeToken(token);
        const user_id = decoded_token.id;

        const event = await eventService.createEvent(title, formated_date, shortDescription, longDescription, address, int_price, int_maximumCapacity, int_category, user_id)

        res.status(201).json({ event });
    } catch (error) {
        throw error;
    }
}