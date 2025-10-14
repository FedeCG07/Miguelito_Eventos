import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export async function getAllEvents(req: Request, res: Response) {
    try {
        const events = await eventService.getAllEvents();

        res.status(200).json({ events });
    } catch (error) {
        throw error;
    }
}