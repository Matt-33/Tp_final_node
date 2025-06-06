import { Router } from "express";
import { menuCategoriesController } from "../controllers/menuCategories.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

router.get("/", menuCategoriesController.getAll);
router.get("/:id", menuCategoriesController.getById);

router.post(
	"/",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	menuCategoriesController.create
);
router.put(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	menuCategoriesController.update
);
router.delete(
	"/:id",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	menuCategoriesController.delete
);

export default router;
