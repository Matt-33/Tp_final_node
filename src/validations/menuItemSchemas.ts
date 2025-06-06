import { z } from "zod";

export const createMenuItemSchema = z.object({
    restaurantId: z.string().uuid({
        message: "L'ID du restaurant doit être un UUID valide"
    }),
    categoryId: z.string().uuid().optional(),
    name: z.string().min(1, "Le nom du plat est requis"),
    description: z.string().optional(),
    price: z.string().or(z.number()).transform(val => 
        typeof val === 'string' ? val : val.toString()),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().default(true),
    isVegetarian: z.boolean().default(false),
    isVegan: z.boolean().default(false),
    isGlutenFree: z.boolean().default(false),
    allergens: z.string().optional()
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
