import { db } from "../db/index";
import { reviews } from "../shemas";
import { eq, desc, sql } from "drizzle-orm";

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

	getByRestaurantId: (restaurantId: string) => {
		return db.query.reviews.findMany({
			where: eq(reviews.restaurantId, restaurantId),
			with: {
				user: true,
			},
			orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
		});
	},

	getByUserId: (userId: string) => {
		return db.query.reviews.findMany({
			where: eq(reviews.userId, userId),
			with: {
				restaurant: true,
			},
			orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
		});
	},

	getAverageRatingByRestaurant: async (restaurantId: string) => {
		const result = await db
			.select({
				averageRating: sql`AVG(${reviews.rating})`,
				totalReviews: sql`COUNT(*)`,
			})
			.from(reviews)
			.where(eq(reviews.restaurantId, restaurantId))
			.execute();

		return result[0] || { averageRating: 0, totalReviews: 0 };
	},
};
