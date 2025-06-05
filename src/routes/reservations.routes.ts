import { Router } from "express";
import { reservationsController } from "../controllers/reservations.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

// Routes pour utilisateurs authentifiés
router.post("/", authenticateJWT, reservationsController.create);

// Routes pour récupérer ses propres réservations
router.get("/my", authenticateJWT, (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Utilisateur non authentifié",
    });
  }

  // Filtrer les réservations par l'ID de l'utilisateur
  reservationsController.getByUserId(req, res);
});

// Routes pour administrateurs et propriétaires
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "owner"),
  reservationsController.getAll
);
router.get("/:id", authenticateJWT, reservationsController.getById);
router.put("/:id", authenticateJWT, reservationsController.update);
router.delete("/:id", authenticateJWT, reservationsController.delete);

// Confirmer une réservation
router.patch(
  "/:id/confirm",
  authenticateJWT,
  authorizeRoles("admin", "owner"),
  reservationsController.confirm
);

// Annuler une réservation
router.patch("/:id/cancel", authenticateJWT, (req, res) => {
  const { id } = req.params;

  // Vérifier si l'utilisateur est propriétaire de la réservation ou admin
  const isAdmin = req.user?.role === "admin" || req.user?.role === "owner";

  // Mettre à jour le statut de la réservation pour l'annuler
  reservationsController.update(
    { ...req, body: { status: "cancelled" }, params: { id } },
    res
  );
});

export default router;
