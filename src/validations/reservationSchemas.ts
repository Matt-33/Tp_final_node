import { z } from "zod";

export const createReservationSchema = z.object({
    userId: z.string().uuid().optional(),
    restaurantId: z.string().uuid({
        required_error: "L'ID du restaurant est requis",
        invalid_type_error: "L'ID du restaurant doit être un UUID valide"
    }),
    tableId: z.string().uuid().optional(),
    reservationDate: z.string().or(z.date(), {
        required_error: "La date de réservation est requise"
    }),
    duration: z.number().positive().default(120), // minutes
    partySize: z.number().positive().default(1),
    specialRequests: z.string().optional(),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
        invalid_type_error: "Statut invalide"
    }).default("pending"),
    confirmed: z.boolean().default(false)
});

export const updateReservationSchema = createReservationSchema.partial();

export const confirmReservationSchema = z.object({
    confirmed: z.literal(true).default(true),
    status: z.literal("confirmed").default("confirmed")
});

export const cancelReservationSchema = z.object({
    status: z.literal("cancelled").default("cancelled")
});
