import { Router } from "express";
import { restaurantsController } from "../controllers/restaurants.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

// Routes publiques
router.get("/", restaurantsController.getAll);
router.get("/:id", restaurantsController.getById);

// Routes pour afficher les éléments liés à un restaurant spécifique (publiques)
router.get("/:restaurantId/tables", restaurantsController.getAllTables);
router.get("/:restaurantId/tables/available", restaurantsController.getAvailableTables);
router.get("/:restaurantId/menu-categories", restaurantsController.getMenuCategories);
router.get("/:restaurantId/menu-items", restaurantsController.getMenuItems);
router.get("/:restaurantId/reviews", restaurantsController.getReviews);
router.get("/:restaurantId/rating", restaurantsController.getAverageRating);

// Routes protégées pour les propriétaires et administrateurs
router.post("/", authenticateJWT, authorizeRoles("admin", "owner"), restaurantsController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin", "owner"), restaurantsController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin", "owner"), restaurantsController.delete);

// Routes protégées pour les réservations (accessible aux propriétaires et admins)
router.get("/:restaurantId/reservations", authenticateJWT, authorizeRoles("admin", "owner"), 
  restaurantsController.getReservations);
router.get("/:restaurantId/reservations/upcoming", authenticateJWT, authorizeRoles("admin", "owner"), 
  restaurantsController.getUpcomingReservations);

export default router;
