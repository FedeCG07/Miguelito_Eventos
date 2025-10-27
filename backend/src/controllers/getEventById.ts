import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export async function getEventById(req: Request, res: Response) {
    try {
        const id = req.params?.id;

        const event = await eventService.getEventById(id)

        res.status(200).json({ event });
    } catch (error) {
        throw error
    }
}