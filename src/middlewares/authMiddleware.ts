import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { usersModel } from "../models/usersModel";

export interface AuthRequest extends Request {
	user?: any;
}

export const authenticateJWT = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({ error: "Token manquant" });
			return;
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "defaultsecret"
		);

		req.user = decoded;

		next();
	} catch (error) {
		console.error("JWT Authentication error:", error);
		res.status(403).json({ error: "Token invalide ou expiré" });
	}
};
