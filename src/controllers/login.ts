import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export async function login(req: Request, res: Response) {
    try {
        const oldToken = req.cookies?.token;

        if (oldToken) {
            throw new Error;
        }

        const { emailOrUsername, password } = req.body;

        const user = await userService.logIn(emailOrUsername, password);

        const token = authService.createToken({
            id: user.id
        });

        res.cookie('token', token, {
            httpOnly: true,       // prevents JS access (safe)
            secure: false,        // set to true if using HTTPS
            sameSite: 'strict',      // solo permite usarla en el mismo dominio de origen
            maxAge: 1000 * 60 * 60 // 1 hour
        });

        res.status(200).json({ message: 'Inicio de sesón exitoso' });
    } catch (error) {
        throw error;
    }
}