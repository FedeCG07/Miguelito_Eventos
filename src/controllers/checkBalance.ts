import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export async function checkBalance(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;

        if (!token) throw new Error;

        const decodedToken = authService.decodeToken(token);
        const userId = decodedToken.id;

        const balance = await userService.checkBalance(userId);

        res.status(200).json(balance);
    } catch (error) {
        throw error;
    }
}