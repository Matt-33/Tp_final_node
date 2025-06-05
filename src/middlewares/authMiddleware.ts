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
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) return res.status(401).json({ error: "Token manquant" });

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "defaultsecret"
		);

		// Set user information from token
		req.user = decoded;

		// If we need to fetch complete user data, uncomment this:
		/*
        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
            const userId = decoded.id;
            const user = await usersModel.getById(userId);
            if (user) {
                req.user = user;
            }
        }
        */

		next();
	} catch (error) {
		console.error("JWT Authentication error:", error);
		return res.status(403).json({ error: "Token invalide ou expiré" });
	}
};
