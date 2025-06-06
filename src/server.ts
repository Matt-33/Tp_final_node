import express from "express";
import cors from "cors";
import "dotenv/config";
import { testDatabaseConnection } from "./db/index";
import routes from "./routes/index";
import Logger from "./utils/logger";
import { logger, apiLogger, errorLogger } from "./middlewares/loggingMiddleware";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares de journalisation
app.use(logger);
app.use(apiLogger);

// Routes
app.use("/api", routes);

// Gestion des erreurs
app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

async function startServer() {
	try {
		await testDatabaseConnection();
		Logger.info("✅ Base de données connectée avec succès");

		app.listen(PORT, () => {
			Logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`);
			Logger.info(`📚 Documentation API: http://localhost:${PORT}/api`);
		});
	} catch (err) {
		if (err instanceof Error) {
			Logger.error(`❌ Erreur lors du démarrage du serveur: ${err.message}`, {
				stack: err.stack,
			});
		} else {
			Logger.error("❌ Erreur inconnue lors du démarrage du serveur");
		}
		process.exit(1);
	}
}

startServer();
