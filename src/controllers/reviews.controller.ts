import { Request, Response } from "express";
import { reviewsModel } from "../models/reviewsModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const reviewsController = {
  /**
   * Créer un nouvel avis
   */
  create: async (req: AuthRequest, res: Response) => {
    try {
      const { restaurantId, rating, comment, visitDate } = req.body;

      // Utiliser l'ID de l'utilisateur authentifié ou celui fourni dans la requête
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(400).json({ 
          success: false,
          error: "L'ID de l'utilisateur est requis" 
        });
      }

      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          error: "L'ID du restaurant est requis" 
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false,
          error: "La note doit être comprise entre 1 et 5" 
        });
      }

      const newReview = await reviewsModel.create({
        userId,
        restaurantId,
        rating,
        comment,
        visitDate: visitDate ? new Date(visitDate) : undefined
      });

      res.status(201).json({
        success: true,
        message: "Avis créé avec succès",
        data: newReview[0]
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'avis:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la création de l'avis" 
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
        data: reviews
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des avis" 
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
        return res.status(404).json({ 
          success: false,
          error: "Avis non trouvé" 
        });
      }

      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de l'avis:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération de l'avis" 
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
      
      // Vérifier si l'avis existe
      const existingReview = await reviewsModel.getById(id);
      
      if (!existingReview) {
        return res.status(404).json({ 
          success: false,
          error: "Avis non trouvé" 
        });
      }

      // Vérifier que l'utilisateur est l'auteur de l'avis (ou un admin)
      if (req.user && req.user.id !== existingReview.userId && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Vous n'êtes pas autorisé à modifier cet avis"
        });
      }

      // Valider la note
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ 
          success: false,
          error: "La note doit être comprise entre 1 et 5" 
        });
      }

      // Mettre à jour l'avis
      const updateData: any = {};
      if (rating) updateData.rating = rating;
      if (comment !== undefined) updateData.comment = comment;
      if (visitDate) updateData.visitDate = new Date(visitDate);
      
      const updatedReview = await reviewsModel.update(id, updateData);

      res.status(200).json({
        success: true,
        message: "Avis mis à jour avec succès",
        data: updatedReview
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avis:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la mise à jour de l'avis" 
      });
    }
  },

  /**
   * Supprimer un avis
   */
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      // Vérifier si l'avis existe
      const existingReview = await reviewsModel.getById(id);
      
      if (!existingReview) {
        return res.status(404).json({ 
          success: false,
          error: "Avis non trouvé" 
        });
      }

      // Vérifier que l'utilisateur est l'auteur de l'avis (ou un admin)
      if (req.user && req.user.id !== existingReview.userId && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Vous n'êtes pas autorisé à supprimer cet avis"
        });
      }

      // Supprimer l'avis
      await reviewsModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Avis supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la suppression de l'avis" 
      });
    }
  }
};
