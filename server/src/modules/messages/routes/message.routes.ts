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

router.patch(
  "/:messageId",
  messageController.updateMessage
);

router.delete(
  "/:messageId",
  messageController.deleteMessage
);

export default router;