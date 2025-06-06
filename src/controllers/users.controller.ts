import { Request, Response } from "express";
import { usersModel } from "../models/usersModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import argon2 from "argon2";

export const usersController = {
	/**
	 * Créer un nouvel utilisateur
	 */
	create: async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				email,
				phone,
				firstName,
				lastName,
				city,
				postalCode,
				username,
				password,
				address,
				role,
			} = req.body;

			const existingUser = await usersModel.getByEmail(email);
			if (existingUser) {
				res.status(409).json({
					success: false,
					error: "Un utilisateur avec cet email existe déjà",
				});
				return;
			}

			const hashedPassword = await argon2.hash(password);

			const newUser = await usersModel.create({
				email,
				phone,
				firstName,
				lastName,
				city,
				postalCode,
				username,
				password: hashedPassword,
				address,
				role: role || "customer",
			});

			const { password: _, ...userWithoutPassword } = newUser[0];

			res.status(201).json({
				success: true,
				message: "Utilisateur créé avec succès",
				data: userWithoutPassword,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la création de l'utilisateur:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la création de l'utilisateur",
			});
		}
	},

	/**
	 * Récupérer tous les utilisateurs
	 */
	getAll: async (_req: Request, res: Response) => {
		try {
			const users = await usersModel.getAll();
			const usersWithoutPasswords = users.map((user) => {
				const { password, ...userWithoutPassword } = user;
				return userWithoutPassword;
			});

			res.status(200).json({
				success: true,
				count: users.length,
				data: usersWithoutPasswords,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des utilisateurs:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération des utilisateurs",
			});
		}
	},

	/**
	 * Récupérer un utilisateur par son ID
	 */
	getById: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const user = await usersModel.getById(id);

			if (!user) {
				res.status(404).json({
					success: false,
					error: "Utilisateur non trouvé",
				});
				return;
			}

			const { password, ...userWithoutPassword } = user;

			res.status(200).json({
				success: true,
				data: userWithoutPassword,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération de l'utilisateur:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération de l'utilisateur",
			});
		}
	},

	/**
	 * Mettre à jour un utilisateur
	 */
	update: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const {
				email,
				phone,
				firstName,
				lastName,
				city,
				postalCode,
				username,
				password,
				address,
				role,
			} = req.body;

			const existingUser = await usersModel.getById(id);

			if (!existingUser) {
				res.status(404).json({
					success: false,
					error: "Utilisateur non trouvé",
				});
				return;
			}

			const updateData: any = {
				email,
				phone,
				firstName,
				lastName,
				city,
				postalCode,
				username,
				address,
				role,
			};

			if (password) {
				updateData.password = await argon2.hash(password);
			}

			const updatedUser = await usersModel.update(id, updateData);

			const { password: _, ...userWithoutPassword } =
				updatedUser[0] || {};

			res.status(200).json({
				success: true,
				message: "Utilisateur mis à jour avec succès",
				data: userWithoutPassword,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la mise à jour de l'utilisateur:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la mise à jour de l'utilisateur",
			});
		}
	},

	/**
	 * Supprimer un utilisateur
	 */
	delete: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			const existingUser = await usersModel.getById(id);

			if (!existingUser) {
				res.status(404).json({
					success: false,
					error: "Utilisateur non trouvé",
				});
				return;
			}

			await usersModel.delete(id);

			res.status(200).json({
				success: true,
				message: "Utilisateur supprimé avec succès",
			});
		} catch (error) {
			console.error(
				"Erreur lors de la suppression de l'utilisateur:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la suppression de l'utilisateur",
			});
		}
	},

	/**
	 * Récupérer le profil de l'utilisateur connecté
	 */
	getProfile: async (req: AuthRequest, res: Response): Promise<void> => {
		try {
			if (!req.user || !req.user.id) {
				res.status(401).json({
					success: false,
					error: "Utilisateur non authentifié",
				});
				return;
			}

			const user = await usersModel.getById(req.user.id);

			if (!user) {
				res.status(404).json({
					success: false,
					error: "Profil utilisateur non trouvé",
				});
				return;
			}

			const { password, ...userWithoutPassword } = user;

			res.status(200).json({
				success: true,
				data: userWithoutPassword,
			});
		} catch (error) {
			console.error("Erreur lors de la récupération du profil:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération du profil utilisateur",
			});
		}
	},
};
