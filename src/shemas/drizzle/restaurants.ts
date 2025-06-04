import {
	pgTable,
	uuid,
	varchar,
	text,
	timestamp,
	integer,
	time,
} from "drizzle-orm/pg-core";
import { users } from "./usersModel";

export const restaurants = pgTable("restaurants", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	postalCode: varchar("postal_code", { length: 20 }).notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	email: varchar("email", { length: 255 }),
	description: text("description"),
	cuisine: varchar("cuisine", { length: 50 }),
	priceRange: varchar("price_range", { length: 10 }),
	capacity: integer("capacity").notNull(),
	openingTime: time("opening_time").notNull(),
	closingTime: time("closing_time").notNull(),
	imageUrl: varchar("image_url", { length: 255 }),
	ownerId: uuid("owner_id").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
