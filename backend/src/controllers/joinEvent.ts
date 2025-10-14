import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthService } from '../services/authService';

const eventService = new EventService();
const authService = new AuthService();

export async function joinEvent(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;
        const { eventId, amount } = req.body;
        const int_amount = +amount;

        if (!token) throw new Error;

        const decoded_token = authService.decodeToken(token);
        const user_id = decoded_token.id;

        const user_event = await eventService.joinEvent(eventId, user_id, int_amount);

        res.status(201).json({ user_event });
    } catch (error) {
        throw error;
    }
}