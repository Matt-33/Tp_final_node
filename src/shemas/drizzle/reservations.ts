import {
	pgTable,
	uuid,
	timestamp,
	integer,
	varchar,
	boolean,
} from "drizzle-orm/pg-core";
import { users } from "./usersModel";
import { restaurants } from "./restaurants";
import { tables } from "./tables";

export const reservations = pgTable("reservations", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id)
		.notNull(),
	restaurantId: uuid("restaurant_id")
		.references(() => restaurants.id)
		.notNull(),
	tableId: uuid("table_id").references(() => tables.id),
	reservationDate: timestamp("reservation_date").notNull(),
	duration: integer("duration_minutes").default(120).notNull(),
	partySize: integer("party_size").notNull(),
	specialRequests: varchar("special_requests", { length: 500 }),
	status: varchar("status", { length: 20 }).default("pending").notNull(),
	confirmed: boolean("confirmed").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
