import { db } from "../db/index";
import { users } from "../shemas";
import { eq } from "drizzle-orm";

type UserInsert = typeof users.$inferInsert;
type UserUpdate = Partial<Omit<UserInsert, "id" | "createdAt">>;

export const usersModel = {
	create: (user: UserInsert) => {
		return db.insert(users).values(user).returning().execute();
	},

	getById: (id: string) => {
		return db.query.users.findFirst({
			where: eq(users.id, id),
		});
	},

	getByEmail: (email: string) => {
		return db.query.users.findFirst({
			where: eq(users.email, email),
		});
	},

	getAll: () => {
		return db.query.users.findMany();
	},

	update: (id: string, data: UserUpdate) => {
		return db.update(users).set(data).where(eq(users.id, id)).execute();
	},

	delete: (id: string) => {
		return db.delete(users).where(eq(users.id, id)).execute();
	},
};
