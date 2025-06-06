import { z } from "zod";

export const createUserSchema = z.object({
	email: z
		.string({
			required_error: "L'adresse email est requise",
			invalid_type_error: "L'adresse email doit être une chaîne de caractères",
		})
		.email({ message: "Format d'email invalide" }),

	phone: z
		.string({
			required_error: "Le numéro de téléphone est requis",
		})
		.min(1, { message: "Le numéro de téléphone ne peut pas être vide" }),

	firstName: z
		.string({
			required_error: "Le prénom est requis",
		})
		.min(1, { message: "Le prénom ne peut pas être vide" }),

	lastName: z
		.string({
			required_error: "Le nom de famille est requis",
		})
		.min(1, { message: "Le nom de famille ne peut pas être vide" }),

	city: z
		.string({
			required_error: "La ville est requise",
		})
		.min(1, { message: "La ville ne peut pas être vide" }),

	postalCode: z
		.string({
			required_error: "Le code postal est requis",
		})
		.min(1, { message: "Le code postal ne peut pas être vide" }),

	username: z
		.string({
			required_error: "Le nom d'utilisateur est requis",
		})
		.min(3, {
			message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
		}),

	password: z
		.string({
			required_error: "Le mot de passe est requis",
		})
		.min(6, {
			message: "Le mot de passe doit contenir au moins 6 caractères",
		}),

	address: z.string().optional(),

	role: z
		.enum(
			["customer", "owner", "admin"],
			{ errorMap: () => ({ message: "Le rôle doit être 'customer', 'owner' ou 'admin'" }) }
		)
		.optional()
		.default("customer"),
});

export const updateUserSchema = createUserSchema.partial();

export const resetPasswordSchema = z.object({
	currentPassword: z
		.string({
			required_error: "Le mot de passe actuel est requis",
		})
		.min(1, { message: "Le mot de passe actuel ne peut pas être vide" }),

	newPassword: z
		.string({
			required_error: "Le nouveau mot de passe est requis",
		})
		.min(6, { message: "Le nouveau mot de passe doit contenir au moins 6 caractères" }),

	confirmPassword: z
		.string({
			required_error: "La confirmation du mot de passe est requise",
		}),
}).refine(data => data.newPassword === data.confirmPassword, {
	message: "Les mots de passe ne correspondent pas",
	path: ["confirmPassword"],
});

export const idParamSchema = z.object({
	id: z
		.string({
			required_error: "L'identifiant est requis",
			invalid_type_error: "L'identifiant doit être une chaîne de caractères",
		})
		.uuid({ message: "Format d'identifiant invalide, doit être un UUID" }),
});
