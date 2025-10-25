import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export async function me(req: Request, res: Response) {
    try {
        const token = req.cookies?.token;

        if (!token) return  res.status(401).json({ user: null });

        const decoded_token = authService.decodeToken(token);

        const user = await userService.getUserById(decoded_token.id)

        res.status(200).json({ user });
    } catch (error) {
        throw error;
    }
}