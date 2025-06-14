import { Request, Response } from "express";
import { reviewsModel } from "../models/reviewsModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import Logger from "../utils/logger";

export const reviewsController = {
	/**
	 * Créer un nouvel avis
	 */
	create: async (req: AuthRequest, res: Response) => {
		try {
			const { restaurantId, rating, comment, visitDate } = req.body;
			const userId = req.user?.id || req.body.userId;


			const newReview = await reviewsModel.create({
				userId,
				restaurantId,
				rating,
				comment,
				visitDate: visitDate ? new Date(visitDate) : undefined,
			});

			res.status(201).json({
				success: true,
				message: "Avis créé avec succès",
				data: newReview[0],
			});
		} catch (error) {
			Logger.error("Erreur lors de la création de l'avis:", { error });
			res.status(500).json({
				success: false,
				error: "Erreur lors de la création de l'avis",
			});
		}
	},

	/**
	 * Récupérer tous les avis
	 */
	getAll: async (_req: Request, res: Response) => {
		try {
			const reviews = await reviewsModel.getAll();

			res.status(200).json({
				success: true,
				count: reviews.length,
				data: reviews,
			});
		} catch (error) {
			Logger.error("Erreur lors de la récupération des avis:", { error });
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération des avis",
			});
		}
	},

	/**
	 * Récupérer un avis par son ID
	 */
	getById: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const review = await reviewsModel.getById(id);

			if (!review) {
				res.status(404).json({
					success: false,
					error: "Avis non trouvé",
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: review,
			});
		} catch (error) {
			Logger.error("Erreur lors de la récupération de l'avis:", { error });
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération de l'avis",
			});
		}
	},

	/**
	 * Mettre à jour un avis
	 */
	update: async (req: AuthRequest, res: Response) => {
		try {
			const { id } = req.params;
			const { rating, comment, visitDate } = req.body;
			const existingReview = await reviewsModel.getById(id);

			if (!existingReview) {
				res.status(404).json({
					success: false,
					error: "Avis non trouvé",
				});
				return;
			}

			// Vérification des droits d'accès (utilisateur propriétaire ou admin)
			if (
				req.user &&
				req.user.id !== existingReview.userId &&
				req.user.role !== "admin"
			) {
				res.status(403).json({
					success: false,
					error: "Vous n'êtes pas autorisé à modifier cet avis",
				});
				return;
			}

			// Les vérifications du format des données sont gérées par Zod
			const updateData: any = {};
			if (rating !== undefined) updateData.rating = rating;
			if (comment !== undefined) updateData.comment = comment;
			if (visitDate) updateData.visitDate = new Date(visitDate);

			const updatedReview = await reviewsModel.update(id, updateData);

			res.status(200).json({
				success: true,
				message: "Avis mis à jour avec succès",
				data: updatedReview,
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour de l'avis:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la mise à jour de l'avis",
			});
		}
	},

	/**
	 * Supprimer un avis
	 */
	delete: async (req: AuthRequest, res: Response) => {
		try {
			const { id } = req.params;
			const existingReview = await reviewsModel.getById(id);

			if (!existingReview) {
				res.status(404).json({
					success: false,
					error: "Avis non trouvé",
				});
				return;
			}
			if (
				req.user &&
				req.user.id !== existingReview.userId &&
				req.user.role !== "admin"
			) {
				res.status(403).json({
					success: false,
					error: "Vous n'êtes pas autorisé à supprimer cet avis",
				});
				return;
			}
			await reviewsModel.delete(id);

			res.status(200).json({
				success: true,
				message: "Avis supprimé avec succès",
			});
		} catch (error) {
			console.error("Erreur lors de la suppression de l'avis:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la suppression de l'avis",
			});
		}
	},
	moderate: async (req: AuthRequest, res: Response) => {
		try {
			const { id } = req.params;
			const { approved, moderationComment } = req.body;

			const existingReview = await reviewsModel.getById(id);
			if (!existingReview) {
				res.status(404).json({
					success: false,
					error: "Avis non trouvé",
				});
				return;
			}

			// Use the correct property names that match the database schema
			const updatedReview = await reviewsModel.update(id, {
				isApproved: approved,
				moderationComment: moderationComment,
			});

			res.status(200).json({
				success: true,
				message: "Avis modéré avec succès",
				data: updatedReview,
			});
		} catch (error) {
			Logger.error("Erreur lors de la modération de l'avis:", { error });
			res.status(500).json({
				success: false,
				error: "Erreur lors de la modération de l'avis",
			});
		}
	},
};
