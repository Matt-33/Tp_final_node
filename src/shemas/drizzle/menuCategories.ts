import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurants";

export const menuCategories = pgTable("menu_categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description")
})
