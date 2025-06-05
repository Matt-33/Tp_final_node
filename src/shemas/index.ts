import { users } from "./drizzle/users";
import { restaurants } from "./drizzle/restaurants";
import { tables } from "./drizzle/tables";
import { reservations } from "./drizzle/reservations";
import { menuCategories, menuItems } from "./drizzle/menuItems";
import { reviews } from "./drizzle/reviews";

// Export direct
export {
	users,
	restaurants,
	tables,
	reservations,
	menuCategories,
	menuItems,
	reviews,
};

export const schema = {
	users,
	restaurants,
	tables,
	reservations,
	menuCategories,
	menuItems,
	reviews,
};

export type Schema = typeof schema;
