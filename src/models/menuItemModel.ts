import { db } from "../db/index";
import { menuItems } from "../shemas";
import { eq, and } from "drizzle-orm";

type MenuItemInsert = typeof menuItems.$inferInsert;
type MenuItemUpdate = Partial<Omit<MenuItemInsert, "id" | "createdAt">>;

export const menuItemModel = {
	create: (menuItem: MenuItemInsert) => {
		return db.insert(menuItems).values(menuItem).returning().execute();
	},

	getById: (id: string) => {
		return db.query.menuItems.findFirst({
			where: eq(menuItems.id, id),
		});
	},

	getAll: () => {
		return db.query.menuItems.findMany();
	},

	update: (id: string, data: MenuItemUpdate) => {
		return db
			.update(menuItems)
			.set(data)
			.where(eq(menuItems.id, id))
			.execute();
	},

	delete: (id: string) => {
		return db.delete(menuItems).where(eq(menuItems.id, id)).execute();
	},

	getByRestaurantId: (restaurantId: string) => {
		return db.query.menuItems.findMany({
			where: eq(menuItems.restaurantId, restaurantId),
			with: {
				category: true,
			},
			orderBy: (menuItems, { asc }) => [asc(menuItems.name)],
		});
	},

	getByCategoryId: (categoryId: string) => {
		return db.query.menuItems.findMany({
			where: eq(menuItems.categoryId, categoryId),
			orderBy: (menuItems, { asc }) => [asc(menuItems.name)],
		});
	},

	getByRestaurantAndCategory: (restaurantId: string, categoryId: string) => {
		return db.query.menuItems.findMany({
			where: and(
				eq(menuItems.restaurantId, restaurantId),
				eq(menuItems.categoryId, categoryId)
			),
			orderBy: (menuItems, { asc }) => [asc(menuItems.name)],
		});
	},
};
