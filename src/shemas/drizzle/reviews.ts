import { pgTable, uuid, timestamp, text, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { restaurants } from "./restaurants";

export const reviews = pgTable("reviews", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	restaurantId: uuid("restaurant_id")
		.notNull()
		.references(() => restaurants.id, { onDelete: "cascade" }),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	visitDate: timestamp("visit_date"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	// Add the missing moderation fields
	isApproved: boolean("is_approved").default(false),
	moderationComment: text("moderation_comment"),
});
