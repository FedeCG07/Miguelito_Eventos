import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export async function login(req: Request, res: Response) {
    try {
        const old_token = req.cookies?.token;

        if (old_token) {
            throw new Error;
        }

        const { identifier, password } = req.body;

        const user = await userService.logIn(identifier, password);

        const token = authService.createToken({
            id: user.id
        });

        res.cookie('token', token, {
            httpOnly: true,       // prevents JS access (safe)
            secure: false,        // set to true if using HTTPS
            sameSite: 'strict',      // solo permite usarla en el mismo dominio de origen
            maxAge: 1000 * 60 * 60 // 1 hour
        });

        res.status(200).json({ user });
    } catch (error) {
        throw error;
    }
}