import { Router } from "express";
import { menuItemsController } from "../controllers/menuItems.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

// Routes publiques
router.get("/", menuItemsController.getAll);
router.get("/:id", menuItemsController.getById);

// Routes protégées pour les propriétaires et administrateurs
router.post("/", authenticateJWT, authorizeRoles("admin", "owner"), menuItemsController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin", "owner"), menuItemsController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin", "owner"), menuItemsController.delete);

export default router;
