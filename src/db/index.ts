import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";

// Configuration du pool de connexion
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Création de l'instance drizzle
export const db = drizzle(pool);

// Fonction pour tester la connexion
export async function testDatabaseConnection() {
	try {
		await pool.connect();
		const db = drizzle(pool);
		console.log("✅ Connexion à PostgreSQL réussie !");
		await pool.end();
	} catch (error) {
		console.log(pool);
		console.error("❌ Erreur de connexion à PostgreSQL :", error);
	}
}
