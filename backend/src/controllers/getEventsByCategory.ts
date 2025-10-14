import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export async function getEventsByCategory(req: Request, res: Response) {
    try {
        const category = req.params.category;
        const int_category = +category;

        const events = await eventService.getEventByCategory(int_category);

        res.status(200).json({ events });
    } catch (error) {
        throw error;
    }
}