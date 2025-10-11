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

        const decodedToken = authService.decodeToken(token);
        const userId = decodedToken.id;

        const user = await userService.addFunds(userId, amount);

        res.status(200).json(user);
    } catch (error) {
        throw error;
    }
}