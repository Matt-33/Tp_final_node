import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { testDatabaseConnection } from './db/index';

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API opérationnelle' });
});

// Routes API
app.use('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API' });
});

// Démarrage du serveur
async function startServer() {
  // Test de connexion à la base de données
  await testDatabaseConnection();
  
  // Démarrage du serveur
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('❌ Erreur lors du démarrage du serveur:', err);
});
