import { db } from "../db/index";
import { reviews } from "../shemas";
import { eq } from "drizzle-orm";

type ReviewInsert = typeof reviews.$inferInsert;
type ReviewUpdate = Partial<Omit<ReviewInsert, "id" | "createdAt">>;

export const reviewsModel = {
	create: (review: ReviewInsert) => {
		return db.insert(reviews).values(review).returning().execute();
	},

	getById: (id: string) => {
		return db.query.reviews.findFirst({
			where: eq(reviews.id, id),
		});
	},

	getAll: () => {
		return db.query.reviews.findMany();
	},

	update: (id: string, data: ReviewUpdate) => {
		return db.update(reviews).set(data).where(eq(reviews.id, id)).execute();
	},

	delete: (id: string) => {
		return db.delete(reviews).where(eq(reviews.id, id)).execute();
	},
};
