import { Category } from "@prisma/client";

import { db } from "../db/db";

export class CategoryRepository {
    async getCategory(id: number) {
        const category = await db.category.findUnique({
            where: {
                id
            }
        })

        if (!category) throw new Error;

        return category;
    }
}