import { Router } from "express";
import * as conversationController from "./conversation.controller";
import { protect as authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

// These will be mounted under /api/workspaces/:workspaceId/conversations
router.get("/", conversationController.getConversations);
router.post("/", conversationController.getOrCreateDM);
router.get("/:conversationId", conversationController.getConversation);

export default router;
