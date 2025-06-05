import { Router } from "express";
import { reviewsController } from "../controllers/reviews.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

// Routes publiques
router.get("/", reviewsController.getAll);
router.get("/:id", reviewsController.getById);

// Routes pour utilisateurs authentifiés
router.post("/", authenticateJWT, reviewsController.create);
router.put("/:id", authenticateJWT, reviewsController.update);
router.delete("/:id", authenticateJWT, reviewsController.delete);

// Routes pour administrateurs (modération des avis)
router.patch(
	"/:id/moderate",
	authenticateJWT,
	authorizeRoles("admin"),
	reviewsController.moderate
);

export default router;
