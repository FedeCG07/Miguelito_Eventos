import { Router } from "express"
import { register } from "../controllers/register"
import { login } from "../controllers/login";
import { logout } from "../controllers/logout";

export const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);