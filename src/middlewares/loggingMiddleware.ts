import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  // Enregistrement du début de la requête
  const start = Date.now();
  
  // Capture de l'IP du client
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Message de départ pour la requête
  Logger.http(`${req.method} ${req.originalUrl} - IP: ${ip}`);
  
  // Capture du statut de la réponse après son envoi
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusMessage = res.statusMessage || '';
    
    // Format de log différent selon le code de statut
    if (statusCode >= 500) {
      Logger.error(`${statusCode} ${statusMessage} ${req.method} ${req.originalUrl} - ${duration}ms - IP: ${ip}`);
    } else if (statusCode >= 400) {
      Logger.warn(`${statusCode} ${statusMessage} ${req.method} ${req.originalUrl} - ${duration}ms - IP: ${ip}`);
    } else {
      Logger.http(`${statusCode} ${statusMessage} ${req.method} ${req.originalUrl} - ${duration}ms - IP: ${ip}`);
    }
  });
  
  next();
};

// Middleware pour les requêtes API
export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log du corps de la requête pour les méthodes POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    Logger.debug('Request body:', req.body);
  }
  
  // Log des paramètres de requête s'il y en a
  if (Object.keys(req.query).length) {
    Logger.debug('Request query:', req.query);
  }
  
  // Log des paramètres d'URL s'il y en a
  if (Object.keys(req.params).length) {
    Logger.debug('Request params:', req.params);
  }
  
  next();
};

// Middleware pour enregistrer les erreurs
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    body: req.body,
    user: req.user || 'anonymous'
  });
  
  next(err);
};
