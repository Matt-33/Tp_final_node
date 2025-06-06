import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";
import { validateBody } from "../middlewares/validateMiddleware";
import { createUserSchema, updateUserSchema } from "../validations/userSchemas";

const router = Router();

router.get("/profile", authenticateJWT, usersController.getProfile);

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

router.post(
	"/",
	authenticateJWT,
	authorizeRoles("admin"),
	validateBody(createUserSchema),
	usersController.create
);

router.put(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin"),
	validateBody(updateUserSchema),
	usersController.update
);

router.delete(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin"),
	usersController.delete
);

export default router;
