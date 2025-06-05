import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema<any>) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json({
				success: false,
				error: result.error.errors?.[0]?.message || "Données invalides",
			});
			return;
		}
		req.body = result.data;
		next();
	};
};
