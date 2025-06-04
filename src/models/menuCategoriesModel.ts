import { db } from "../db/index";
import { menuCategories } from "../shemas";
import { eq } from "drizzle-orm";

type MenuCategoryInsert = typeof menuCategories.$inferInsert;
type MenuCategoryUpdate = Partial<Omit<MenuCategoryInsert, "id" | "createdAt">>;

export const menuCategoriesModel = {
	create: (category: MenuCategoryInsert) => {
		return db.insert(menuCategories).values(category).returning().execute();
	},

	getById: (id: string) => {
		return db.query.menuCategories.findFirst({
			where: eq(menuCategories.id, id),
		});
	},

	getAll: () => {
		return db.query.menuCategories.findMany();
	},

	update: (id: string, data: MenuCategoryUpdate) => {
		return db
			.update(menuCategories)
			.set(data)
			.where(eq(menuCategories.id, id))
			.execute();
	},

	delete: (id: string) => {
		return db
			.delete(menuCategories)
			.where(eq(menuCategories.id, id))
			.execute();
	},
};
