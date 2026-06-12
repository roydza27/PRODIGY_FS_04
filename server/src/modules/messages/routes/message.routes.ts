import { Router } from "express";

import { protect as authMiddleware } from "../../../middlewares/auth.middleware";

import * as messageController from "../controllers/message.controller";

const router = Router();

router.use(authMiddleware);

router.get(
  "/room/:roomId",
  messageController.getRoomHistory
);

router.get(
  "/conversation/:conversationId",
  messageController.getConversationHistory
);

router.get(
  "/search",
  messageController.searchMessages
);

// Shared files — returns messages with attachments for a given context
router.get(
  "/room/:roomId/files",
  messageController.getRoomSharedFiles
);

router.get(
  "/conversation/:conversationId/files",
  messageController.getConversationSharedFiles
);

router.delete(
  "/clear/:context/:contextId",
  messageController.clearChat
);

router.post(
  "/:messageId/reactions",
  messageController.addReaction
);

router.patch(
  "/:messageId",
  messageController.updateMessage
);

router.delete(
  "/:messageId",
  messageController.deleteMessage
);

export default router;