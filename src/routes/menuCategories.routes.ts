import { Router } from "express";
import { menuCategoriesController } from "../controllers/menuCategories.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

// Routes publiques
router.get("/", menuCategoriesController.getAll);
router.get("/:id", menuCategoriesController.getById);

// Routes protégées pour les propriétaires et administrateurs
router.post("/", authenticateJWT, authorizeRoles("admin", "owner"), menuCategoriesController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin", "owner"), menuCategoriesController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin", "owner"), menuCategoriesController.delete);

export default router;
