import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import Logger from "../utils/logger";

const formatZodErrors = (error: ZodError) => {
    return error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
    }));
};

export const validateBody = (schema: ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.body);
            
            if (!result.success) {
                const formattedErrors = formatZodErrors(result.error);
                Logger.warn('Validation error:', { errors: formattedErrors, body: req.body });
                
                res.status(400).json({
                    success: false,
                    errors: formattedErrors,
                    message: "Erreur de validation des données"
                });
                return;
            }
            
            req.body = result.data;
            next();
        } catch (error) {
            Logger.error('Erreur inattendue lors de la validation:', { error });
            res.status(500).json({
                success: false,
                message: "Erreur interne lors de la validation des données"
            });
        }
    };
};

export const validateParams = (schema: ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.params);
            
            if (!result.success) {
                const formattedErrors = formatZodErrors(result.error);
                Logger.warn('Validation error for params:', { errors: formattedErrors, params: req.params });
                
                res.status(400).json({
                    success: false,
                    errors: formattedErrors,
                    message: "Erreur de validation des paramètres"
                });
                return;
            }
            
            req.params = result.data;
            next();
        } catch (error) {
            Logger.error('Erreur inattendue lors de la validation des paramètres:', { error });
            res.status(500).json({
                success: false,
                message: "Erreur interne lors de la validation des paramètres"
            });
        }
    };
};

export const validateQuery = (schema: ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req.query);
            
            if (!result.success) {
                const formattedErrors = formatZodErrors(result.error);
                Logger.warn('Validation error for query:', { errors: formattedErrors, query: req.query });
                
                res.status(400).json({
                    success: false,
                    errors: formattedErrors,
                    message: "Erreur de validation des paramètres de requête"
                });
                return;
            }
            
            req.query = result.data;
            next();
        } catch (error) {
            Logger.error('Erreur inattendue lors de la validation des paramètres de requête:', { error });
            res.status(500).json({
                success: false,
                message: "Erreur interne lors de la validation des paramètres de requête"
            });
        }
    };
};
