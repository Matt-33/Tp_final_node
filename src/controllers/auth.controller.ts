import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { usersModel } from "../models/usersModel";
import { env } from "../config/env";

export const authController = {
	register: async (req: Request, res: Response) => {
		const { email, password, firstName, lastName, phone, username, city, postalCode } = req.body;

		try {
			const existingUser = await usersModel.getByEmail(email);
			if (existingUser) {
				return res.status(409).json({ error: "Email déjà utilisé" });
			}

			console.log("Vérification de l'email:", email);

			const hashedPassword = await argon2.hash(password);

			console.log("Données reçues pour la création de l'utilisateur:")
		console.log({
			email,
			firstName,
			lastName,
			password,
			phone,
			username,
			city,
			postalCode,
		});

			// Créer l'utilisateur
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
			res.status(500).json({
				error: "Erreur serveur lors de l'inscription",
			});
		}
	},

	login: async (req: Request, res: Response) => {
		const { email, password } = req.body;

		try {
			const user = await usersModel.getByEmail(email);
			console.log("Tentative de connexion pour l'utilisateur:", user);

			if (!user) {
				return res
					.status(401)
					.json({ error: "Identifiants invalides" });
			}

			const isValid = await argon2.verify(user.password, password);

			if (!isValid) {
				return res
					.status(401)
					.json({ error: "Mot de passe incorrect" });
			}
			console.log("Mot de passe vérifié pour l'utilisateur:", user.email);
			// Generate JWT with role information
        	const token = jwt.sign(
            { 
                id: user.id,
                role: user.role  // Include role in the token payload
            }, 
            env.JWT_SECRET, 
            { expiresIn: "7d" }
        );
			console.log("Connexion réussie pour l'utilisateur:", token);

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
