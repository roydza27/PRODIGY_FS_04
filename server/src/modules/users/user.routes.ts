import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import * as userController from "./user.controller";

const router = Router();

router.get("/presence", protect, userController.getOnlineUsers);

export default router;
