import { z } from "zod";

export const createUserSchema = z.object({
	email: z.string().email(),
	phone: z.string().min(1),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	city: z.string().min(1),
	postalCode: z.string().min(1),
	username: z.string().min(3),
	password: z.string().min(6),
	address: z.string().optional(),
	role: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();
