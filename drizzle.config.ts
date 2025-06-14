import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
	schema: "./src/shemas/drizzle/*.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DB_HOST! || "localhost",
		port: Number(process.env.DB_PORT!) || 5432,
		user: process.env.DB_USER! || "postgres",
		password: process.env.DB_PASSWORD! || "motdepasse",
		database: process.env.DB_NAME! || "tp_final_db",
	},
});
