import { Router } from "express";
import * as conversationController from "./conversation.controller";
import { protect as authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Global conversation routes (no workspace context)
router.get("/list", conversationController.getConversations);
router.get("/:conversationId", conversationController.getConversation);

export default router;
