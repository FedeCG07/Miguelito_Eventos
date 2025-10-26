import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthService } from '../services/authService';

const eventService = new EventService();
const authService = new AuthService();

export async function getEventsByCategory(req: Request, res: Response) {
    try {
        const category = req.params.category;
        const int_category = +category;
        const token = req.cookies?.token;
        let user_id: string | undefined;

        if (token) {
            const decoded_token = authService.decodeToken(token);
            user_id = decoded_token.id;
        }

        const events = await eventService.getEventByCategory(int_category, user_id);

        res.status(200).json({ events });
    } catch (error) {
        throw error;
    }
}