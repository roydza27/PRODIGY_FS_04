import { Router } from "express";
import { protect as authMiddleware } from "../../middlewares/auth.middleware";
import * as workspaceController from "./workspace.controller";
import roomRouter from "../rooms/room.routes";
import conversationRouter from "../conversations/conversation.routes";

const router = Router();

router.use(authMiddleware);

// Workspace CRUD
router.post("/", workspaceController.createWorkspace);
router.get("/", workspaceController.getWorkspaces);
router.get("/:workspaceId", workspaceController.getWorkspace);
router.patch("/:workspaceId", workspaceController.updateWorkspace);

// Members
router.get("/:workspaceId/members", workspaceController.getMembers);
router.post("/:workspaceId/invite", workspaceController.inviteMember);
router.post("/:workspaceId/accept-invite", workspaceController.acceptInvite);
router.post("/:workspaceId/remove-member", workspaceController.removeMember);
router.patch("/:workspaceId/members/role", workspaceController.updateMemberRole);

// Rooms
router.use("/:workspaceId/rooms", roomRouter);

// Conversations (DMs)
router.use("/:workspaceId/conversations", conversationRouter);

export default router;