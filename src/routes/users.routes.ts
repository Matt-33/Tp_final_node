import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

// Routes protégées par authentification
router.get("/profile", authenticateJWT, usersController.getProfile);

// Routes protégées pour administrateurs
router.get("/", authenticateJWT, authorizeRoles("admin"), usersController.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), usersController.getById);
router.post("/", authenticateJWT, authorizeRoles("admin"), usersController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), usersController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), usersController.delete);

export default router;
