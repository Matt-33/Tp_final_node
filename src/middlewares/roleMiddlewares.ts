import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import Logger from "../utils/logger";

export const authorizeRoles = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction): void => {
		try {
			if (!req.user) {
				res.status(401).json({ success: false, message: "Non authentifié" });
				return; // Just return without a value
			}

			if (!roles.includes(req.user.role)) {
				Logger.warn(
					`Tentative d'accès non autorisé: l'utilisateur ${req.user.id} avec le rôle ${req.user.role} a tenté d'accéder à une ressource réservée aux rôles ${roles.join(
						", "
					)}`
				);
				res.status(403).json({ success: false, message: "Accès non autorisé" });
				return; // Just return without a value
			}

			next();
		} catch (error) {
			Logger.error("Erreur lors de la vérification des rôles:", { error });
			res.status(500).json({ success: false, message: "Erreur serveur" });
			return; // Just return without a value
		}
	};
};
