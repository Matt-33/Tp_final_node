import { Request, Response } from "express";
import { restaurantsModel } from "../models/restaurantsModel";
import { tableModels } from "../models/tablesModel";
import { menuItemModel } from "../models/menuItemModel";
import { menuCategoriesModel } from "../models/menuCategoriesModel";
import { reservationsModel } from "../models/reservationsModel";
import { reviewsModel } from "../models/reviewsModel";

export const restaurantsController = {
  /**
   * Créer un nouveau restaurant
   */
  create: async (req: Request, res: Response) => {
    try {
      const { 
        name, address, city, postalCode, phone, email, description, 
        cuisine, priceRange, capacity, openingTime, closingTime, 
        imageUrl, ownerId 
      } = req.body;

      const newRestaurant = await restaurantsModel.create({
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        description,
        cuisine,
        priceRange,
        capacity,
        openingTime,
        closingTime,
        imageUrl,
        ownerId
      });

      res.status(201).json({
        success: true,
        message: "Restaurant créé avec succès",
        data: newRestaurant[0]
      });
    } catch (error) {
      console.error("Erreur lors de la création du restaurant:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la création du restaurant" 
      });
    }
  },

  /**
   * Récupérer tous les restaurants
   */
  getAll: async (_req: Request, res: Response) => {
    try {
      const restaurants = await restaurantsModel.getAll();
      
      res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurants:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des restaurants" 
      });
    }
  },

  /**
   * Récupérer un restaurant par son ID
   */
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const restaurant = await restaurantsModel.getById(id);

      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }

      res.status(200).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du restaurant:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération du restaurant" 
      });
    }
  },

  /**
   * Mettre à jour un restaurant
   */
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { 
        name, address, city, postalCode, phone, email, description, 
        cuisine, priceRange, capacity, openingTime, closingTime, 
        imageUrl
      } = req.body;
      
      // Vérifier si le restaurant existe
      const existingRestaurant = await restaurantsModel.getById(id);
      
      if (!existingRestaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }

      // Mettre à jour le restaurant
      const updatedRestaurant = await restaurantsModel.update(id, {
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        description,
        cuisine,
        priceRange,
        capacity,
        openingTime,
        closingTime,
        imageUrl
      });

      res.status(200).json({
        success: true,
        message: "Restaurant mis à jour avec succès",
        data: updatedRestaurant
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du restaurant:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la mise à jour du restaurant" 
      });
    }
  },

  /**
   * Supprimer un restaurant
   */
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Vérifier si le restaurant existe
      const existingRestaurant = await restaurantsModel.getById(id);
      
      if (!existingRestaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }

      // Supprimer le restaurant
      await restaurantsModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Restaurant supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du restaurant:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la suppression du restaurant" 
      });
    }
  },

  /**
   * Récupérer toutes les tables d'un restaurant
   */
  getAllTables: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      
      // Vérifier si le restaurant existe
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      const tables = await tableModels.getByRestaurantId(restaurantId);
      
      res.status(200).json({
        success: true,
        count: tables.length,
        data: tables
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des tables:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des tables du restaurant" 
      });
    }
  },
  
  /**
   * Récupérer toutes les tables disponibles d'un restaurant
   */
  getAvailableTables: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      const tables = await tableModels.getAvailableByRestaurantId(restaurantId);
      
      res.status(200).json({
        success: true,
        count: tables.length,
        data: tables
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des tables disponibles:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des tables disponibles" 
      });
    }
  },
  
  /**
   * Récupérer toutes les catégories de menu d'un restaurant
   */
  getMenuCategories: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      const categories = await menuCategoriesModel.getByRestaurantId(restaurantId);
      
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des catégories du menu" 
      });
    }
  },
  
  /**
   * Récupérer tous les plats d'un restaurant
   */
  getMenuItems: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      const { categoryId } = req.query;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      let menuItems;
      
      if (categoryId) {
        menuItems = await menuItemModel.getByRestaurantAndCategory(
          restaurantId, 
          categoryId as string
        );
      } else {
        menuItems = await menuItemModel.getByRestaurantId(restaurantId);
      }
      
      res.status(200).json({
        success: true,
        count: menuItems.length,
        data: menuItems
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des plats:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des plats du menu" 
      });
    }
  },
  
  /**
   * Récupérer toutes les réservations d'un restaurant
   */
  getReservations: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      const { date } = req.query;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      let reservations;
      
      if (date) {
        reservations = await reservationsModel.getByRestaurantAndDate(
          restaurantId, 
          new Date(date as string)
        );
      } else {
        reservations = await reservationsModel.getByRestaurantId(restaurantId);
      }
      
      res.status(200).json({
        success: true,
        count: reservations.length,
        data: reservations
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des réservations" 
      });
    }
  },
  
  /**
   * Récupérer les réservations à venir d'un restaurant
   */
  getUpcomingReservations: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      const reservations = await reservationsModel.getUpcomingByRestaurant(restaurantId);
      
      res.status(200).json({
        success: true,
        count: reservations.length,
        data: reservations
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération des réservations à venir" 
      });
    }
  },
  
  /**
   * Récupérer tous les avis d'un restaurant
   */
  getReviews: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      const reviews = await reviewsModel.getByRestaurantId(restaurantId);
      
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
   * Récupérer la note moyenne d'un restaurant
   */
  getAverageRating: async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      
      const restaurant = await restaurantsModel.getById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          error: "Restaurant non trouvé" 
        });
      }
      
      const ratingData = await reviewsModel.getAverageRatingByRestaurant(restaurantId);
      
      res.status(200).json({
        success: true,
        data: {
          averageRating: parseFloat(ratingData.averageRating?.toFixed(1) || '0'),
          totalReviews: ratingData.totalReviews
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la note moyenne:", error);
      res.status(500).json({ 
        success: false,
        error: "Erreur lors de la récupération de la note moyenne" 
      });
    }
  }
};
