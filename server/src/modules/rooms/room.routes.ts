import { Router } from "express";
import { protect as authMiddleware } from "../../middlewares/auth.middleware";
import * as roomController from "./room.controller";

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", roomController.createRoom);

router.get("/", roomController.getRooms);
router.get("/:roomId", roomController.getRoom);

router.patch("/:roomId", roomController.updateRoom);
router.delete("/:roomId", roomController.deleteRoom);

export default router;