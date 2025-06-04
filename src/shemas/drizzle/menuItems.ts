import { pgTable, uuid, varchar, text, decimal, boolean } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurants";

export const menuCategories = pgTable("menu_categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description")
})

export const menuItems = pgTable("menu_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    categoryId: uuid("category_id").references(() => menuCategories.id),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    isAvailable: boolean("is_available").default(true).notNull(),
    isVegetarian: boolean("is_vegetarian").default(false),
    isVegan: boolean("is_vegan").default(false),
    isGlutenFree: boolean("is_gluten_free").default(false),
    allergens: text("allergens")
})
