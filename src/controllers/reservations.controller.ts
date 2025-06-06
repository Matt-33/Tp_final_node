import { Request, Response } from "express";
import { reservationsModel } from "../models/reservationsModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const reservationsController = {
	/**
	 * Créer une nouvelle réservation
	 */
	create: async (req: AuthRequest, res: Response) => {
		try {
			const {
				restaurantId,
				tableId,
				reservationDate,
				duration,
				partySize,
				specialRequests,
				status,
			} = req.body;

			const userId = req.user?.id || req.body.userId;

			if (!userId) {
				res.status(400).json({
					success: false,
					error: "L'ID de l'utilisateur est requis",
				});
				return;
			}

			if (!restaurantId) {
				res.status(400).json({
					success: false,
					error: "L'ID du restaurant est requis",
				});
				return;
			}

			const newReservation = await reservationsModel.create({
				userId,
				restaurantId,
				tableId,
				reservationDate: new Date(reservationDate),
				duration,
				partySize,
				specialRequests,
				status: status || "pending",
				confirmed: false,
			});

			res.status(201).json({
				success: true,
				message: "Réservation créée avec succès",
				data: newReservation[0],
			});
		} catch (error) {
			console.error(
				"Erreur lors de la création de la réservation:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la création de la réservation",
			});
		}
	},

	/**
	 * Récupérer toutes les réservations
	 */
	getAll: async (_req: Request, res: Response) => {
		try {
			const reservations = await reservationsModel.getAll();

			res.status(200).json({
				success: true,
				count: reservations.length,
				data: reservations,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des réservations:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération des réservations",
			});
		}
	},

	/**
	 * Récupérer une réservation par son ID
	 */
	getById: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const reservation = await reservationsModel.getById(id);

			if (!reservation) {
				res.status(404).json({
					success: false,
					error: "Réservation non trouvée",
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: reservation,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération de la réservation:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération de la réservation",
			});
		}
	},

	/**
	 * Récupérer les réservations d'un utilisateur spécifique
	 */
	getByUserId: async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id || req.params.userId;

			if (!userId) {
				res.status(400).json({
					success: false,
					error: "ID d'utilisateur requis",
				});
				return;
			}

			const userReservations = await reservationsModel.getByUserId(
				userId
			);

			res.status(200).json({
				success: true,
				count: userReservations.length,
				data: userReservations,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des réservations:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la récupération des réservations de l'utilisateur",
			});
		}
	},

	/**
	 * Mettre à jour une réservation
	 */
	update: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const {
				tableId,
				reservationDate,
				duration,
				partySize,
				specialRequests,
				status,
				confirmed,
			} = req.body;

			const existingReservation = await reservationsModel.getById(id);

			if (!existingReservation) {
				res.status(404).json({
					success: false,
					error: "Réservation non trouvée",
				});
				return;
			}

			const updateData: any = {};

			if (tableId) updateData.tableId = tableId;
			if (reservationDate)
				updateData.reservationDate = new Date(reservationDate);
			if (duration) updateData.duration = duration;
			if (partySize) updateData.partySize = partySize;
			if (specialRequests !== undefined)
				updateData.specialRequests = specialRequests;
			if (status) updateData.status = status;
			if (confirmed !== undefined) updateData.confirmed = confirmed;

			const updatedReservation = await reservationsModel.update(
				id,
				updateData
			);

			res.status(200).json({
				success: true,
				message: "Réservation mise à jour avec succès",
				data: updatedReservation,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la mise à jour de la réservation:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la mise à jour de la réservation",
			});
		}
	},

	/**
	 * Confirmer une réservation
	 */
	confirm: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const existingReservation = await reservationsModel.getById(id);

			if (!existingReservation) {
				res.status(404).json({
					success: false,
					error: "Réservation non trouvée",
				});
				return;
			}

			const updatedReservation = await reservationsModel.update(id, {
				confirmed: true,
				status: "confirmed",
			});

			res.status(200).json({
				success: true,
				message: "Réservation confirmée avec succès",
				data: updatedReservation,
			});
		} catch (error) {
			console.error(
				"Erreur lors de la confirmation de la réservation:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la confirmation de la réservation",
			});
		}
	},

	/**
	 * Supprimer une réservation
	 */
	delete: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			const existingReservation = await reservationsModel.getById(id);

			if (!existingReservation) {
				res.status(404).json({
					success: false,
					error: "Réservation non trouvée",
				});
				return;
			}

			await reservationsModel.delete(id);

			res.status(200).json({
				success: true,
				message: "Réservation supprimée avec succès",
			});
		} catch (error) {
			console.error(
				"Erreur lors de la suppression de la réservation:",
				error
			);
			res.status(500).json({
				success: false,
				error: "Erreur lors de la suppression de la réservation",
			});
		}
	},
	cancel: async (req: AuthRequest, res: Response) => {
		try {
			const { id } = req.params;

			const reservation = await reservationsModel.getById(id);
			if (!reservation) {
				res.status(404).json({
					success: false,
					error: "Réservation non trouvée",
				});
				return;
			}

			const isAdmin =
				req.user?.role === "admin" || req.user?.role === "owner";
			const isOwner = req.user?.id === reservation.userId;

			if (!isAdmin && !isOwner) {
				res.status(403).json({
					success: false,
					error: "Non autorisé à annuler cette réservation",
				});
				return;
			}

			const updated = await reservationsModel.update(id, {
				status: "cancelled",
			});

			res.status(200).json({
				success: true,
				message: "Réservation annulée avec succès",
				data: updated,
			});
			return;
		} catch (error) {
			console.error("Erreur lors de l'annulation:", error);
			res.status(500).json({
				success: false,
				error: "Erreur lors de l'annulation de la réservation",
			});
			return;
		}
	},
};
