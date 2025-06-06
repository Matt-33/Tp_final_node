import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { usersModel } from "../models/usersModel";
import { env } from "../config/env";
import Logger from "../utils/logger";

export const authController = {
	register: async (req: Request, res: Response) => {
		const {
			email,
			password,
			firstName,
			lastName,
			phone,
			username,
			city,
			postalCode,
		} = req.body;

		try {
			const existingUser = await usersModel.getByEmail(email);
			if (existingUser) {
				Logger.warn(`Tentative d'inscription avec un email déjà utilisé: ${email}`);
				res.status(409).json({ error: "Email déjà utilisé" });
				return;
			}

			Logger.info(`Nouvelle inscription en cours pour: ${email}`);
			const hashedPassword = await argon2.hash(password);

			const newUser = await usersModel.create({
				email,
				password: hashedPassword,
				firstName,
				lastName,
				phone,
				username,
				city,
				postalCode,
			});

			res.status(201).json({
				message: "Utilisateur créé",
				user: newUser,
			});
		} catch (err) {
			Logger.error("Erreur register:", { error: err });
			res.status(500).json({
				error: "Erreur serveur lors de l'inscription",
			});
		}
	},

	login: async (req: Request, res: Response): Promise<void> => {
		const { email, password } = req.body;

		try {
			const user = await usersModel.getByEmail(email);
			Logger.info(`Tentative de connexion pour: ${email}`);

			if (!user) {
				Logger.warn(`Échec de connexion: utilisateur non trouvé pour ${email}`);
				res.status(401).json({ error: "Identifiants invalides" });
				return;
			}

			const isValid = await argon2.verify(user.password, password);

			if (!isValid) {
				Logger.warn(`Échec de connexion: mot de passe incorrect pour l'utilisateur ${user.id}`);
				res.status(401).json({ error: "Mot de passe incorrect" });
				return;
			}
			
			Logger.info(`Authentification réussie pour l'utilisateur: ${user.id}`);
			const token = jwt.sign(
				{
					id: user.id,
					role: user.role,
				},
				env.JWT_SECRET,
				{ expiresIn: "7d" }
			);

			Logger.info(`Token JWT généré pour l'utilisateur: ${user.id}`);
			res.json({ message: "Connexion réussie", token, user });
		} catch (err) {
			Logger.error("Erreur serveur lors de la connexion", { error: err });
			res.status(500).json({
				error: "Erreur serveur lors de la connexion",
			});
		}
	},

	me: async (req: Request, res: Response) => {
		try {
			const user = req.user;
			Logger.debug(`Récupération du profil utilisateur: ${user.id}`);
			res.json(user);
		} catch (err) {
			Logger.error("Erreur lors de la récupération du profil", { error: err });
			res.status(401).json({ error: "Non autorisé" });
		}
	},
};
