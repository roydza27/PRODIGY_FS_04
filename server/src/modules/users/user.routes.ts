import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import * as userController from "./user.controller";

const router = Router();

router.get("/search", protect, userController.searchUsers);
router.get("/presence", protect, userController.getPresence);
router.get("/:id", protect, userController.getUserById);

export default router;
