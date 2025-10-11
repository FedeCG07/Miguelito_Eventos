import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export async function register(req: Request, res: Response) {
    try {
        const { firstName, lastName, username, DNI, email, password } = req.body;
        const user = userService.register(firstName, lastName, username, DNI, email, password);

        res.status(201).json({ message: 'Registro exitoso' });
    } catch (error) {
        throw error;
    }
}