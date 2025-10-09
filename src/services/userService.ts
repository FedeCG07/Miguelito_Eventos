import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";

const userRepository = new UserRepository();

const salt_rounds = Number(process.env.SALT_ROUNDS)

export class UserService {
    async register(firstName: string, lastName: string, username: string, DNI: string, email: string, password: string) {
        try {
            if (username.includes('@')) throw new Error;

            const hashed_password = await bcrypt.hash(password, salt_rounds);
            const new_user = await userRepository.createUser(firstName, lastName, username, DNI, email, hashed_password);

            return new_user;
        } catch (error) {
            throw error;
        }
    }

    async login(emailOrUsername: string, inputPassword: string) {
        try {
            const isEmail = emailOrUsername.includes('@');

            const user = isEmail ? 
                await userRepository.getUserByEmail(emailOrUsername)
                : 
                await userRepository.getUserByUsername(emailOrUsername)

            const password = user.password;

            const correctPassword = bcrypt.compare(inputPassword, password)
            if (!correctPassword) throw new Error;

            return user;
        } catch (error) {
            throw error;
        }
    }

    async addFunds(id: string, amount: number) {
        try {
            const user = await userRepository.increaseBalance(id, amount);

            return user;
        } catch (error) {
            throw error;
        }
    }
}