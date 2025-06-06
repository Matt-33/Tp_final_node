import { users } from "./drizzle/users";
import { restaurants } from "./drizzle/restaurants";
import { tables } from "./drizzle/tables";
import { reservations } from "./drizzle/reservations";
import { menuItems } from "./drizzle/menuItems";
import { menuCategories } from "./drizzle/menuCategories";
import { reviews } from "./drizzle/reviews";

// Définit l'objet schema contenant tous les modèles
export const schema = {
	users,
	restaurants,
	tables,
	reservations,
	menuCategories,
	menuItems,
	reviews,
};

// Exporte le type Schema basé sur l'objet schema
export type Schema = typeof schema;

// Re-exporte chaque modèle individuellement pour un import plus facile
export {
	users,
	restaurants,
	tables,
	reservations,
	menuCategories,
	menuItems,
	reviews,
};
