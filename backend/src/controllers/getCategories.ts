import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

const categoryService = new CategoryService();

export async function getAllCategories(req: Request, res: Response) {
    try {
        const categories = await categoryService.getCategories();

        res.status(200).json({ categories });
    } catch (error) {
        throw error;
    }
}