import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorizeRoles = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		console.log(`Authorizing roles: ${roles.join(", ")}`); // Debugging line
		console.log(`User info:`, JSON.stringify(req.user || {}, null, 2)); // Debugging line
		if (!req.user)
			return res
				.status(401)
				.json({ error: "Utilisateur non authentifié" });
		if (!roles.includes(req.user.role)) {
			return res
				.status(403)
				.json({ error: "Accès interdit : rôle insuffisant" });
		}
		next();
	};
};
