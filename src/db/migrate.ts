import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";
import Logger from "../utils/logger";

async function runMigration() {
	Logger.info("⏳ Lancement des migrations...");
	Logger.info(`Tentative de connexion à la base de données...`);

	try {
		const client = await pool.connect();
		Logger.info("✅ Connexion à la base de données établie");
		client.release();

		await migrate(db, { migrationsFolder: "migrations" });
		Logger.info("✅ Migrations appliquées avec succès !");
	} catch (error) {
		Logger.error("❌ Erreur lors des migrations:", { error });
		Logger.info("\n👉 Vérifiez que:");
		Logger.info("  1. Votre serveur PostgreSQL est en cours d'exécution");
		Logger.info("  2. Les informations de connexion dans le fichier .env sont correctes");
		Logger.info("  3. La base de données existe (créez-la manuellement si nécessaire)");
		process.exit(1);
	}
}

runMigration();
