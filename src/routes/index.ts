import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import restaurantsRoutes from "./restaurants.routes";
import tablesRoutes from "./tables.routes";
import reservationsRoutes from "./reservations.routes";
import menuCategoriesRoutes from "./menuCategories.routes";
import menuItemsRoutes from "./menuItems.routes";
import reviewsRoutes from "./reviews.routes";

const router = Router();

// Middleware pour vérifier que l'API est active
router.get("/", (req, res) => {
  res.json({ message: "API de réservation de restaurants opérationnelle" });
});

// Routes de l'API
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/restaurants", restaurantsRoutes);
router.use("/tables", tablesRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/menu-categories", menuCategoriesRoutes);
router.use("/menu-items", menuItemsRoutes);
router.use("/reviews", reviewsRoutes);

export default router;
