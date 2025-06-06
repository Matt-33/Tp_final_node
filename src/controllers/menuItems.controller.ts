import { Request, Response } from "express";
import { menuItemModel } from "../models/menuItemModel";

export const menuItemsController = {
	/**
	 * Créer un nouveau plat
	 */
	create: async (req: Request, res: Response) => {
		try {
			const {
				restaurantId,
				categoryId,
				name,
				description,
				price,
				imageUrl,
				isAvailable,
				isVegetarian,
				isVegan,
				isGlutenFree,
				allergens,
			} = req.body;

			if (!restaurantId) {
				res.status(400).json({
					success: false,
					error: "L'identifiant du restaurant est requis",
				});
				return;
			}

			const newMenuItem = await menuItemModel.create({
				restaurantId,
				categoryId,
				name,
				description,
				price,
				imageUrl,
				isAvailable: isAvailable !== undefined ? isAvailable : true,
				isVegetarian: isVegetarian || false,
				isVegan: isVegan || false,
				isGlutenFree: isGlutenFree || false,
				allergens,
			});

			res.status(201).json({
				success: true,
				message: "Plat créé avec succès",
				data: newMenuItem[0],
			});
		} catch (error) {
			console.error("Erreur lors de la création du plat:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la création du plat",
			});
		}
	},

	/**
	 * Récupérer tous les plats
	 */
	getAll: async (_req: Request, res: Response) => {
		try {
			const menuItems = await menuItemModel.getAll();

			res.status(200).json({
				success: true,
				count: menuItems.length,
				data: menuItems,
			});
		} catch (error) {
			console.error("Erreur lors de la récupération des plats:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération des plats",
			});
		}
	},

	/**
	 * Récupérer un plat par son ID
	 */
	getById: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const menuItem = await menuItemModel.getById(id);

			if (!menuItem) {
				res.status(404).json({
					success: false,
					error: "Plat non trouvé",
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: menuItem,
			});
		} catch (error) {
			console.error("Erreur lors de la récupération du plat:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération du plat",
			});
		}
	},

	/**
	 * Mettre à jour un plat
	 */
	update: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const {
				categoryId,
				name,
				description,
				price,
				imageUrl,
				isAvailable,
				isVegetarian,
				isVegan,
				isGlutenFree,
				allergens,
			} = req.body;

			const existingMenuItem = await menuItemModel.getById(id);

			if (!existingMenuItem) {
				res.status(404).json({
					success: false,
					error: "Plat non trouvé",
				});
				return;
			}

			const updatedMenuItem = await menuItemModel.update(id, {
				categoryId,
				name,
				description,
				price,
				imageUrl,
				isAvailable,
				isVegetarian,
				isVegan,
				isGlutenFree,
				allergens,
			});

			res.status(200).json({
				success: true,
				message: "Plat mis à jour avec succès",
				data: updatedMenuItem,
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour du plat:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la mise à jour du plat",
			});
		}
	},

	/**
	 * Supprimer un plat
	 */
	delete: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			const existingMenuItem = await menuItemModel.getById(id);

			if (!existingMenuItem) {
				res.status(404).json({
					success: false,
					error: "Plat non trouvé",
				});
				return;
			}
			await menuItemModel.delete(id);

			res.status(200).json({
				success: true,
				message: "Plat supprimé avec succès",
			});
		} catch (error) {
			console.error("Erreur lors de la suppression du plat:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la suppression du plat",
			});
		}
	},
};
