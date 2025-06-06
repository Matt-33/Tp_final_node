import { Router } from "express";
import { tablesController } from "../controllers/tables.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

router.get(
	"/",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	tablesController.getAll
);
router.get(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	tablesController.getById
);
router.post(
	"/",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	tablesController.create
);
router.put(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	tablesController.update
);
router.delete(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	tablesController.delete
);

export default router;
