import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorizeRoles = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({ error: "Utilisateur non authentifié" });
			return;
		}
		if (!roles.includes(req.user.role)) {
			res.status(403).json({
				error: "Accès interdit : rôle insuffisant",
			});
			return;
		}
		next();
	};
};
