import { Router } from "express";
import { reviewsController } from "../controllers/reviews.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";

const router = Router();

router.get("/", reviewsController.getAll);
router.get("/:id", reviewsController.getById);

router.post("/", authenticateJWT, reviewsController.create);
router.put("/:id", authenticateJWT, reviewsController.update);
router.delete("/:id", authenticateJWT, reviewsController.delete);

router.patch(
	"/:id/moderate",
	authenticateJWT,
	authorizeRoles("admin"),
	reviewsController.moderate
);

export default router;
