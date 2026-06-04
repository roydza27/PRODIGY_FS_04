import { Router } from "express";
import { protect as authMiddleware } from "../../middlewares/auth.middleware";
import * as roomController from "./room.controller";

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// These routes expect to be mounted under /api/workspaces/:workspaceId/rooms
// Alternatively, if mounted at /api/rooms, we would need to pass workspaceId in body or query.
// Let's mount them directly at /api/workspaces/:workspaceId/rooms

router.post("/", roomController.createRoom);
router.get("/", roomController.getRooms);
router.get("/:roomId", roomController.getRoom);

export default router;
