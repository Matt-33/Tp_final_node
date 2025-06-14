import { Router, Response } from "express";
import { reservationsController } from "../controllers/reservations.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddlewares";
import { AuthRequest } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateJWT, reservationsController.create);

router.get("/my", authenticateJWT, (req: AuthRequest, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		res.status(401).json({
			success: false,
			error: "Utilisateur non authentifié",
		});
		return;
	}

	return reservationsController.getByUserId(req, res);
});

router.get(
	"/",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	reservationsController.getAll
);
router.get("/:id", authenticateJWT, reservationsController.getById);
router.put("/:id", authenticateJWT, reservationsController.update);
router.delete("/:id", authenticateJWT, reservationsController.delete);

router.patch(
	"/:id/confirm",
	authenticateJWT,
	authorizeRoles("admin", "owner"),
	reservationsController.confirm
);

router.patch("/:id/cancel", authenticateJWT, reservationsController.cancel);

export default router;
