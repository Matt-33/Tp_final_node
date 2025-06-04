import { pgTable, uuid, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurants";

export const tables = pgTable("tables", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    tableNumber: integer("table_number").notNull(),
    capacity: integer("capacity").notNull(),
    location: varchar("location", { length: 50 }),
    isAvailable: boolean("is_available").default(true).notNull()
})
