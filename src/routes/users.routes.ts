import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";
import { validateBody } from "../middlewares/validateMiddleware";
import { createUserSchema, updateUserSchema } from "../validations/userSchemas";

const router = Router();

// Récupération du profil de l'utilisateur connecté (auth uniquement)
router.get("/profile", authenticateJWT, usersController.getProfile);

// Routes admin protégées
router.get(
	"/",
	authenticateJWT,
	authorizeRoles("admin"),
	usersController.getAll
);

router.get(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin"),
	usersController.getById
);

// Création d'un utilisateur avec validation de la requête
router.post(
	"/",
	authenticateJWT,
	authorizeRoles("admin"),
	validateBody(createUserSchema),
	usersController.create
);

// Mise à jour d'un utilisateur avec validation de la requête
router.put(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin"),
	validateBody(updateUserSchema),
	usersController.update
);

// Suppression d'un utilisateur
router.delete(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin"),
	usersController.delete
);

export default router;
