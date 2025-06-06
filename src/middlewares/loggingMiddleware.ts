import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  Logger.http(`${req.method} ${req.originalUrl} - IP: ${ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusMessage = res.statusMessage || '';
    
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

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    Logger.debug('Request body:', req.body);
  }
  
  if (Object.keys(req.query).length) {
    Logger.debug('Request query:', req.query);
  }
  
  if (Object.keys(req.params).length) {
    Logger.debug('Request params:', req.params);
  }
  
  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    body: req.body,
    user: res.locals.user || 'anonymous'
  });
  
  next(err);
};
