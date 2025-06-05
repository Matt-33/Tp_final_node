import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: any;
}

export const authenticateJWT = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: "Token manquant" });

	const token = authHeader.split(" ")[1];
	jwt.verify(
		token,
		process.env.JWT_SECRET || "defaultsecret",
		(err, user) => {
			if (err) return res.status(403).json({ error: "Token invalide" });
			req.user = user;
			next();
		}
	);
};
