import { Router } from "express"
import { register } from "../controllers/register"
import { login } from "../controllers/login";
import { logout } from "../controllers/logout";
import { addFunds } from "../controllers/addFunds";
import { checkBalance } from "../controllers/checkBalance";
import { me } from "../controllers/me";

export const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.post('/add/:amount', addFunds)
userRouter.get('/balance', checkBalance)
//userRouter.get('/me', me)