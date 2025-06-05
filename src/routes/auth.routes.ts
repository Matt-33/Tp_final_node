import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

// Routes publiques
router.post("/register", authController.register);
router.post("/login", authController.login);

// Route protégée
router.get("/me", authenticateJWT, authController.me);

export default router;
