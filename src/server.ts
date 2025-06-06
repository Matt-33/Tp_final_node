import express from "express";
import cors from "cors";
import "dotenv/config";
import { testDatabaseConnection } from "./db/index";
import routes from "./routes/index";
import { logger } from "./middlewares/loggingMiddleware";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
	await testDatabaseConnection();

	app.listen(PORT, () => {
		console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
		console.log(`📚 Documentation API: http://localhost:${PORT}/api`);
	});
}

startServer().catch((err) => {
	console.error("❌ Erreur lors du démarrage du serveur:", err);
});
