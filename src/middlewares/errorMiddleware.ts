import { Request, Response, NextFunction } from "express";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		error: err.message || "Erreur interne du serveur",
	});
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`Route non trouvée - ${req.originalUrl}`);
	res.status(404);
	next(error);
};
