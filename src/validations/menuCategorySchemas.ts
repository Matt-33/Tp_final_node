import { z } from "zod";

export const createMenuCategorySchema = z.object({
    restaurantId: z.string({
        required_error: "L'ID du restaurant est requis",
        invalid_type_error: "L'ID du restaurant doit être une chaîne de caractères"
    }).uuid("L'ID du restaurant doit être un UUID valide"),
    name: z.string({
        required_error: "Le nom de la catégorie est requis",
        invalid_type_error: "Le nom de la catégorie doit être une chaîne de caractères"
    }).min(1, "Le nom de la catégorie ne peut pas être vide"),
    description: z.string().optional()
});

export const updateMenuCategorySchema = createMenuCategorySchema.partial().omit({ restaurantId: true });
