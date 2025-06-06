import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { usersModel } from "../models/usersModel";
import Logger from "../utils/logger";

export interface AuthRequest extends Request {
	user?: any;
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({ error: "Authentification requise" });
			return;
		}

		const token = authHeader.split(" ")[1];

		const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
		const user = await usersModel.getById(decoded.id);

		if (!user) {
			res.status(401).json({ error: "Utilisateur non trouvé" });
			return;
		}

		const { password, ...userWithoutPassword } = user;

		res.locals.user = userWithoutPassword;
		next();
	} catch (error) {
		Logger.error("Erreur d'authentification:", { error });
		res.status(401).json({ error: "Token invalide ou expiré" });
		return;
	}
};

export const authenticateJWT = authMiddleware;

export const requireRole = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!res.locals.user) {
			res.status(401).json({ error: "Authentification requise" });
			return;
		}

		if (!roles.includes(res.locals.user.role)) {
			res.status(403).json({ error: "Accès non autorisé" });
			return;
		}

		next();
	};
};
