import { Router } from "express"
import { getAllCategories } from "../controllers/getCategories"

export const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);