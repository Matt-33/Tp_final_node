import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { testDatabaseConnection } from './db/index';
// Correction de l'importation du router
import routes from './routes/index';
import { logger } from './middlewares/loggingMiddleware';
import { errorHandler, notFound } from './middlewares/errorMiddleware';

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes API - vérifier que routes est bien un routeur Express
app.use('/api', routes);

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
async function startServer() {
  // Test de connexion à la base de données
  await testDatabaseConnection();
  
  // Démarrage du serveur
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Documentation API: http://localhost:${PORT}/api`);
  });
}

startServer().catch(err => {
  console.error('❌ Erreur lors du démarrage du serveur:', err);
});
