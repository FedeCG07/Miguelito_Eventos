import { CategoryRepository } from "../repositories/categoryRepository";

const categoryRepository = new CategoryRepository();

export class CategoryService {
    async getCategories() {
        try {
            const categories = categoryRepository.getAllCategories();

            return categories;
        } catch (error) {
            throw error;
        }
    }
}