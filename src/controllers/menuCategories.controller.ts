import { Request, Response } from "express";
import { menuCategoriesModel } from "../models/menuCategoriesModel";

export const menuCategoriesController = {
	/**
	 * Créer une nouvelle catégorie de menu
	 */
	create: async (req: Request, res: Response) => {
		try {
			const { name, description, restaurantId } = req.body;

			if (!restaurantId) {
				res.status(400).json({
					error: "L'identifiant du restaurant est requis",
				});
			}

			const newCategory = await menuCategoriesModel.create({
				name,
				description,
				restaurantId,
			});

			res.status(201).json({
				success: true,
				message: "Catégorie de menu créée avec succès",
				data: newCategory[0],
			});
			return;
		} catch (error) {
			console.error("Erreur lors de la création de la catégorie:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la création de la catégorie de menu",
			});
		}
	},

	/**
	 * Récupérer toutes les catégories de menu
	 */
	getAll: async (_req: Request, res: Response) => {
		try {
			const categories = await menuCategoriesModel.getAll();

			res.status(200).json({
				success: true,
				count: categories.length,
				data: categories,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des catégories:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération des catégories de menu",
			});
		}
	},

	/**
	 * Récupérer une catégorie de menu par son ID
	 */
	getById: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const category = await menuCategoriesModel.getById(id);

			if (!category) {
				res.status(404).json({
					success: false,
					error: "Catégorie de menu non trouvée",
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: category,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération de la catégorie:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération de la catégorie de menu",
			});
		}
	},

	/**
	 * Mettre à jour une catégorie de menu existante
	 */
	update: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const { name, description } = req.body;

			// Vérifier si la catégorie existe
			const existingCategory = await menuCategoriesModel.getById(id);

			if (!existingCategory) {
				res.status(404).json({
					success: false,
					error: "Catégorie de menu non trouvée",
				});
				return;
			}
			const updatedCategory = await menuCategoriesModel.update(id, {
				name,
				description,
			});

			res.status(200).json({
				success: true,
				message: "Catégorie de menu mise à jour avec succès",
				data: updatedCategory,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la mise à jour de la catégorie:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la mise à jour de la catégorie de menu",
			});
		}
	},

	/**
	 * Supprimer une catégorie de menu
	 */
	delete: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const existingCategory = await menuCategoriesModel.getById(id);

			if (!existingCategory) {
				res.status(404).json({
					success: false,
					error: "Catégorie de menu non trouvée",
				});
				return;
			}

			// Supprimer la catégorie
			await menuCategoriesModel.delete(id);

			res.status(200).json({
				success: true,
				message: "Catégorie de menu supprimée avec succès",
			});
		} catch (error) {
			console.error(
				"Erreur lors de la suppression de la catégorie:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la suppression de la catégorie de menu",
			});
		}
	},
};
