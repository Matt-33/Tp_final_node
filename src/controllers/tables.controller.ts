import { Request, Response } from "express";
import { tableModels } from "../models/tablesModel";

export const tablesController = {
  /**
   * Créer une nouvelle table
   */
  create: async (req: Request, res: Response) => {
    try {
      const { restaurantId, tableNumber, capacity, location, isAvailable } = req.body;

      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          error: "L'identifiant du restaurant est requis" 
        });
      }

      const newTable = await tableModels.create({
        restaurantId,
        tableNumber,
        capacity,
        location,
        isAvailable
      });

      res.status(201).json({
        success: true,
        message: "Table créée avec succès",
        data: newTable[0]
      });
    } catch (error) {
      console.error("Erreur lors de la création de la table:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la création de la table" 
      });
    }
  },

  /**
   * Récupérer toutes les tables
   */
  getAll: async (_req: Request, res: Response) => {
    try {
      const tables = await tableModels.getAll();
      
      res.status(200).json({
        success: true,
        count: tables.length,
        data: tables
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des tables:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des tables" 
      });
    }
  },

  /**
   * Récupérer une table par son ID
   */
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const table = await tableModels.getById(id);

      if (!table) {
        return res.status(404).json({ 
          success: false,
          error: "Table non trouvée" 
        });
      }

      res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la table:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération de la table" 
      });
    }
  },

  /**
   * Mettre à jour une table
   */
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { tableNumber, capacity, location, isAvailable } = req.body;
      
      // Vérifier si la table existe
      const existingTable = await tableModels.getById(id);
      
      if (!existingTable) {
        return res.status(404).json({ 
          success: false,
          error: "Table non trouvée" 
        });
      }

      // Mettre à jour la table
      const updatedTable = await tableModels.update(id, {
        tableNumber,
        capacity,
        location,
        isAvailable
      });

      res.status(200).json({
        success: true,
        message: "Table mise à jour avec succès",
        data: updatedTable
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la table:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la mise à jour de la table" 
      });
    }
  },

  /**
   * Supprimer une table
   */
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Vérifier si la table existe
      const existingTable = await tableModels.getById(id);
      
      if (!existingTable) {
        return res.status(404).json({ 
          success: false,
          error: "Table non trouvée" 
        });
      }

      // Supprimer la table
      await tableModels.delete(id);

      res.status(200).json({
        success: true,
        message: "Table supprimée avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la table:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la suppression de la table" 
      });
    }
  }
};
