import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export async function getAssistingUsers(req: Request, res: Response) {
    try {
        const event_id = req.params.id;

        const users = await eventService.getEventAssistingUsers(event_id)

        res.status(201).json({ users });
    } catch (error) {
        throw error;
    }
}