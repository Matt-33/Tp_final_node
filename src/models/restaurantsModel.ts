import { db } from "../db/index";
import { restaurants } from "../shemas";
import { eq } from "drizzle-orm";

type RestaurantInsert = typeof restaurants.$inferInsert;
type RestaurantUpdate = Partial<Omit<RestaurantInsert, "id" | "createdAt">>;

export const restaurantsModel = {
	create: (restaurant: RestaurantInsert) => {
		return db.insert(restaurants).values(restaurant).returning().execute();
	},

	getById: (id: string) => {
		return db.query.restaurants.findFirst({
			where: eq(restaurants.id, id),
		});
	},

	getAll: () => {
		return db.query.restaurants.findMany();
	},

	update: (id: string, data: RestaurantUpdate) => {
		return db
			.update(restaurants)
			.set(data)
			.where(eq(restaurants.id, id))
			.execute();
	},

	delete: (id: string) => {
		return db.delete(restaurants).where(eq(restaurants.id, id)).execute();
	},
};
