import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthService } from '../services/authService';

const eventService = new EventService();
const authService = new AuthService();

export async function getCreatedEvents(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;
        
        if (!token) throw new Error;

        const decoded_token = authService.decodeToken(token);
        const user_id = decoded_token.id;

        const events = await eventService.getEventsByCreator(user_id)

        res.status(200).json({ events });
    } catch (error) {
        throw error;
    }
}