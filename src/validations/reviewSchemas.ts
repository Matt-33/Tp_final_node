import { z } from "zod";

export const createReviewSchema = z.object({
  userId: z.string().uuid().optional(),
  restaurantId: z.string().uuid({
    required_error: "L'ID du restaurant est requis",
    invalid_type_error: "L'ID du restaurant doit être un UUID valide"
  }),
  rating: z.number({
    required_error: "La note est requise",
    invalid_type_error: "La note doit être un nombre"
  }).min(1, "La note doit être au moins de 1").max(5, "La note ne peut pas dépasser 5"),
  comment: z.string().optional(),
  visitDate: z.string().or(z.date()).optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export const moderateReviewSchema = z.object({
  approved: z.boolean(),
  moderationComment: z.string().optional()
});
