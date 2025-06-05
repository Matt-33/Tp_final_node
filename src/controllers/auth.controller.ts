import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { usersModel } from "../models/usersModel";
import { env } from "../config/env";

export const authController = {
	register: async (req: Request, res: Response) => {
		const { email, password, firstName, lastName } = req.body;

		try {
			const existingUser = await usersModel.getByEmail(email);
			if (existingUser) {
				res.status(409).json({ error: "Email déjà utilisé" });
			}

			const hashedPassword = await argon2.hash(password);

			const newUser = await usersModel.create({
				email,
				password: hashedPassword,
				firstName,
				lastName,
				phone: "",
				username: "",
				city: "",
				postalCode: "",
			});

			res.status(201).json({
				message: "Utilisateur créé",
				user: newUser,
			});
			return;
		} catch (err) {
			res.status(500).json({
				error: "Erreur serveur lors de l'inscription",
			});
		}
	},

	login: async (req: Request, res: Response): Promise<void> => {
		const { email, password } = req.body;

		try {
			const user = await usersModel.getByEmail(email);

			if (!user) {
				res.status(401).json({ error: "Identifiants invalides" });
				return;
			}

			const isValid = await argon2.verify(user.password, password);

			if (!isValid) {
				res.status(401).json({ error: "Mot de passe incorrect" });
				return;
			}

			const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
				expiresIn: "7d",
			});

			res.json({ message: "Connexion réussie", token, user });
		} catch (err) {
			res.status(500).json({
				error: "Erreur serveur lors de la connexion",
			});
		}
	},

	me: async (req: Request, res: Response) => {
		try {
			const user = req.user;
			res.json(user);
		} catch (err) {
			res.status(401).json({ error: "Non autorisé" });
		}
	},
};
