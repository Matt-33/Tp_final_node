import { pgTable, uuid, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./users";
import { restaurants } from "./restaurants";

export const reviews = pgTable("reviews", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id)
		.notNull(),
	restaurantId: uuid("restaurant_id")
		.references(() => restaurants.id)
		.notNull(),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	visitDate: timestamp("visit_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
