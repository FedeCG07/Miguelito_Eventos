import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export async function addFunds(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;
        const amount: number = +req.params.amount;
        
        if (!token) throw new Error;

        const decoded_token = authService.decodeToken(token);
        const user_id = decoded_token.id;

        const user = await userService.addFunds(user_id, amount);

        res.status(200).json(user);
    } catch (error) {
        throw error;
    }
}