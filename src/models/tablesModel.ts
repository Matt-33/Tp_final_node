import { db } from "../db/index";
import { tables } from "../shemas";
import { eq } from "drizzle-orm";

type TableInsert = typeof tables.$inferInsert;
type TableUpdate = Partial<Omit<TableInsert, "id" | "createdAt">>;

export const tableModels = {
	create: (table: TableInsert) => {
		return db.insert(tables).values(table).returning().execute();
	},

	getById: (id: string) => {
		return db.query.tables.findFirst({
			where: eq(tables.id, id),
		});
	},

	getAll: () => {
		return db.query.tables.findMany();
	},

	update: (id: string, data: TableUpdate) => {
		return db.update(tables).set(data).where(eq(tables.id, id)).execute();
	},

	delete: (id: string) => {
		return db.delete(tables).where(eq(tables.id, id)).execute();
	},

	getByRestaurantId: (restaurantId: string) => {
		return db.query.tables.findMany({
			where: eq(tables.restaurantId, restaurantId),
			orderBy: (tables, { asc }) => [asc(tables.tableNumber)],
		});
	},

	getAvailableByRestaurantId: (restaurantId: string) => {
		return db.query.tables.findMany({
			where: (tables, { and, eq }) =>
				and(eq(tables.restaurantId, restaurantId), eq(tables.isAvailable, true)),
			orderBy: (tables, { asc }) => [asc(tables.tableNumber)],
		});
	},
};
