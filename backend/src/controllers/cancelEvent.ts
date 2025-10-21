import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthService } from '../services/authService';

const eventService = new EventService();
const authService = new AuthService();

export async function cancelEvent(req: Request, res: Response) {
    try {
        const event_id = req.params?.id;
        const token = req.cookies?.token;
        
        if (!token) throw new Error;

        const cancelled_event = eventService.cancelEvent(event_id);

        res.status(200).json(cancelled_event);
    } catch (error) {
        throw error;
    }
}