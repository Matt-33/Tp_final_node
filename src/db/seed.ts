import { pool, db } from "./index";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import {
	usersModel,
	restaurantsModel,
	tableModels,
	menuCategoriesModel,
	menuItemModel,
	reservationsModel,
	reviewsModel,
} from "../models";
import Logger from "../utils/logger";

const DEFAULT_PASSWORD = "password123";

async function seed() {
	Logger.info("🌱 Début du seeding...");

	try {
		const client = await pool.connect();
		Logger.info("✅ Connexion à la base de données établie");

		Logger.info("🧹 Nettoyage des données existantes...");

		try {
			await client.query("BEGIN");

			await client.query("SET session_replication_role = replica");

			await client.query(
				"TRUNCATE TABLE users, restaurants, tables, menu_categories, menu_items, reservations, reviews CASCADE"
			);

			await client.query("SET session_replication_role = DEFAULT");

			await client.query("COMMIT");
			Logger.info("✅ Données existantes nettoyées avec succès");
		} catch (truncateError) {
			await client.query("ROLLBACK");
			Logger.error("❌ Erreur lors du nettoyage des tables:", {
				error: truncateError,
			});
			throw truncateError;
		}

		client.release();
		Logger.info("Création des utilisateurs...");
		const adminId = uuidv4();
		const ownerId = uuidv4();
		const customerId = uuidv4();

		const hashedPassword = await argon2.hash(DEFAULT_PASSWORD);

		const admin = await usersModel.create({
			id: adminId,
			email: "admin@example.com",
			phone: "0123456789",
			firstName: "Admin",
			lastName: "User",
			city: "Paris",
			postalCode: "75001",
			username: "admin",
			password: hashedPassword,
			address: "1 rue de l'Administration",
			role: "admin",
		});

		const owner = await usersModel.create({
			id: ownerId,
			email: "owner@example.com",
			phone: "0234567891",
			firstName: "Restaurant",
			lastName: "Owner",
			city: "Lyon",
			postalCode: "69001",
			username: "restowner",
			password: hashedPassword,
			address: "2 rue de la Gastronomie",
			role: "owner",
		});

		const customer = await usersModel.create({
			id: customerId,
			email: "client@example.com",
			phone: "0345678912",
			firstName: "John",
			lastName: "Doe",
			city: "Marseille",
			postalCode: "13001",
			username: "johndoe",
			password: hashedPassword,
			address: "3 rue des Clients",
			role: "customer",
		});

		Logger.info("✅ Utilisateurs créés avec succès");
		Logger.info("Création des restaurants...");

		const restaurant1Id = uuidv4();
		const restaurant2Id = uuidv4();
		const restaurant1 = await restaurantsModel.create({
			id: restaurant1Id,
			name: "La Belle Assiette",
			address: "10 rue de la Gastronomie",
			city: "Paris",
			postalCode: "75002",
			phone: "0123456789",
			email: "contact@labelleasseiette.com",
			description: "Restaurant gastronomique français au cœur de Paris",
			cuisine: "Française",
			priceRange: "€€€",
			capacity: 60,
			openingTime: "11:30",
			closingTime: "23:00",
			imageUrl: "https://example.com/restaurant1.jpg",
			ownerId: ownerId,
		});

		const restaurant2 = await restaurantsModel.create({
			id: restaurant2Id,
			name: "Sushi Paradise",
			address: "15 avenue des Sushis",
			city: "Lyon",
			postalCode: "69002",
			phone: "0234567891",
			email: "contact@sushiparadise.com",
			description: "Le meilleur restaurant japonais de Lyon",
			cuisine: "Japonaise",
			priceRange: "€€",
			capacity: 40,
			openingTime: "12:00",
			closingTime: "22:30",
			imageUrl: "https://example.com/restaurant2.jpg",
			ownerId: ownerId,
		});

		Logger.info("✅ Restaurants créés avec succès");
		Logger.info("Création des tables...");

		const table1Id = uuidv4();
		const table2Id = uuidv4();
		const table3Id = uuidv4();
		const table4Id = uuidv4();

		await tableModels.create({
			id: table1Id,
			restaurantId: restaurant1Id,
			tableNumber: 1,
			capacity: 2,
			location: "Fenêtre",
			isAvailable: true,
		});

		await tableModels.create({
			id: table2Id,
			restaurantId: restaurant1Id,
			tableNumber: 2,
			capacity: 4,
			location: "Centre",
			isAvailable: true,
		});

		await tableModels.create({
			id: table3Id,
			restaurantId: restaurant2Id,
			tableNumber: 1,
			capacity: 2,
			location: "Bar à sushi",
			isAvailable: true,
		});

		await tableModels.create({
			id: table4Id,
			restaurantId: restaurant2Id,
			tableNumber: 2,
			capacity: 6,
			location: "Salon privé",
			isAvailable: true,
		});

		Logger.info("✅ Tables créées avec succès");

		Logger.info("Création des catégories de menu...");

		const frenchEntreesId = uuidv4();
		const frenchMainsId = uuidv4();
		const japaneseSushiId = uuidv4();
		const japaneseNoodlesId = uuidv4();

		await menuCategoriesModel.create({
			id: frenchEntreesId,
			restaurantId: restaurant1Id,
			name: "Entrées",
			description: "Nos délicieuses entrées françaises",
		});

		await menuCategoriesModel.create({
			id: frenchMainsId,
			restaurantId: restaurant1Id,
			name: "Plats principaux",
			description: "Sélection de plats principaux gastronomiques",
		});

		await menuCategoriesModel.create({
			id: japaneseSushiId,
			restaurantId: restaurant2Id,
			name: "Sushis & Sashimis",
			description: "Sushis et sashimis préparés par notre chef",
		});

		await menuCategoriesModel.create({
			id: japaneseNoodlesId,
			restaurantId: restaurant2Id,
			name: "Nouilles & Soupes",
			description: "Nouilles et soupes traditionnelles japonaises",
		});

		Logger.info("✅ Catégories de menu créées avec succès");
		Logger.info("Création des plats...");

		await menuItemModel.create({
			id: uuidv4(),
			restaurantId: restaurant1Id,
			categoryId: frenchEntreesId,
			name: "Foie Gras Maison",
			description:
				"Foie gras de canard fait maison, chutney de figues et pain brioché",
			price: "18.50",
			imageUrl: "https://example.com/foiegras.jpg",
			isAvailable: true,
			isVegetarian: false,
			isVegan: false,
			isGlutenFree: false,
			allergens: "Foie de canard, gluten",
		});

		await menuItemModel.create({
			id: uuidv4(),
			restaurantId: restaurant1Id,
			categoryId: frenchMainsId,
			name: "Filet de bœuf Rossini",
			description:
				"Filet de bœuf, foie gras poêlé, sauce aux truffes et pommes fondantes",
			price: "34.00",
			imageUrl: "https://example.com/filetbeef.jpg",
			isAvailable: true,
			isVegetarian: false,
			isVegan: false,
			isGlutenFree: true,
			allergens: "Bœuf, foie de canard",
		});

		await menuItemModel.create({
			id: uuidv4(),
			restaurantId: restaurant2Id,
			categoryId: japaneseSushiId,
			name: "Assortiment de Sashimis",
			description: "18 pièces de sashimis: thon, saumon, dorade",
			price: "24.00",
			imageUrl: "https://example.com/sashimi.jpg",
			isAvailable: true,
			isVegetarian: false,
			isVegan: false,
			isGlutenFree: true,
			allergens: "Poisson cru, soja",
		});

		await menuItemModel.create({
			id: uuidv4(),
			restaurantId: restaurant2Id,
			categoryId: japaneseNoodlesId,
			name: "Ramen Tonkotsu",
			description:
				"Nouilles ramen dans un bouillon de porc crémeux avec porc braisé et œuf mollet",
			price: "16.50",
			imageUrl: "https://example.com/ramen.jpg",
			isAvailable: true,
			isVegetarian: false,
			isVegan: false,
			isGlutenFree: false,
			allergens: "Gluten, œuf, porc",
		});

		Logger.info("✅ Plats créés avec succès");
		Logger.info("Création des réservations...");

		const today = new Date();
		today.setHours(19, 30, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(20, 0, 0, 0);

		await reservationsModel.create({
			id: uuidv4(),
			userId: customerId,
			restaurantId: restaurant1Id,
			tableId: table1Id,
			reservationDate: today,
			duration: 120,
			partySize: 2,
			specialRequests: "Table près de la fenêtre si possible",
			status: "confirmed",
			confirmed: true,
		});

		await reservationsModel.create({
			id: uuidv4(),
			userId: customerId,
			restaurantId: restaurant2Id,
			tableId: table3Id,
			reservationDate: tomorrow,
			duration: 90,
			partySize: 2,
			specialRequests: "Table au bar à sushi",
			status: "pending",
			confirmed: false,
		});

		Logger.info("✅ Réservations créées avec succès");
		Logger.info("Création des avis...");

		const lastMonth = new Date();
		lastMonth.setMonth(lastMonth.getMonth() - 1);

		await reviewsModel.create({
			id: uuidv4(),
			userId: customerId,
			restaurantId: restaurant1Id,
			rating: 5,
			comment:
				"Excellent repas, service impeccable et cadre magnifique. Je recommande vivement!",
			visitDate: lastMonth,
		});

		await reviewsModel.create({
			id: uuidv4(),
			userId: ownerId,
			restaurantId: restaurant2Id,
			rating: 4,
			comment:
				"Très bons sushis, frais et bien préparés. Le service pourrait être un peu plus rapide.",
			visitDate: lastMonth,
		});

		Logger.info("✅ Avis créés avec succès");

		Logger.info("🎉 Seeding terminé avec succès !");
		Logger.info("\nInformations de connexion:");
		Logger.info("- Admin: admin@example.com / password123");
		Logger.info("- Propriétaire: owner@example.com / password123");
		Logger.info("- Client: client@example.com / password123");
	} catch (error) {
		Logger.error("❌ Erreur lors du seeding:", { error });
		// Fix the TypeScript error by checking if error is an object with a cause property
		if (error && typeof error === "object" && "cause" in error) {
			Logger.error("Cause détaillée:", {
				cause: (error as { cause: unknown }).cause,
			});
		}
	} finally {
		// Fermer la connexion
		await pool.end();
		process.exit(0);
	}
}

seed();
