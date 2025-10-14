import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export async function checkBalance(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;

        if (!token) throw new Error;

        const decoded_token = authService.decodeToken(token);
        const user_id = decoded_token.id;

        const balance = await userService.checkBalance(user_id);

        res.status(200).json(balance);
    } catch (error) {
        throw error;
    }
}