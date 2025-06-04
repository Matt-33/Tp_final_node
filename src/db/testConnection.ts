import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import "dotenv/config";

const client = new Client({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

async function testConnection() {
	try {
		await client.connect();
		const db = drizzle(client);
		console.log("✅ Connexion à PostgreSQL réussie !");
		await client.end();
	} catch (error) {
		console.error("❌ Erreur de connexion à PostgreSQL :", error);
	}
}

testConnection();
