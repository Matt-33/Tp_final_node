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
router.patch("/:id/moderate", authenticateJWT, authorizeRoles("admin"), (req, res) => {
  const { id } = req.params;
  const { approved, moderationComment } = req.body;
  
  // Mettre à jour l'avis avec les infos de modération
  reviewsController.update(
    { ...req, body: { approved, moderationComment } },
    res
  );
});

export default router;
