import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import { schema, Schema } from "../shemas";

export const pool = new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

export const db = drizzle<Schema>(pool, { schema });

export async function testDatabaseConnection() {
	try {
		await pool.connect();
		console.log("✅ Connexion à PostgreSQL réussie !");
		return true;
	} catch (error) {
		console.error("❌ Erreur de connexion à PostgreSQL :", error);
	}
}
