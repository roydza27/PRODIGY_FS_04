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
router.get("/search", workspaceController.searchWorkspaces);
router.get("/invites", workspaceController.getPendingInvites);
router.get("/:workspaceId", workspaceController.getWorkspace);
router.patch("/:workspaceId", workspaceController.updateWorkspace);
router.delete("/:workspaceId", workspaceController.deleteWorkspace);
router.post("/:workspaceId/leave", workspaceController.leaveWorkspace);

// Members & Invites
router.get("/:workspaceId/members", workspaceController.getMembers);
router.post("/:workspaceId/members/invite", workspaceController.inviteMember);
router.delete("/:workspaceId/members/:memberId", workspaceController.removeMember);
router.patch("/:workspaceId/members/:memberId", workspaceController.updateMemberRole);

// Legacy/Compatibility Invite Actions (kept for safety if frontend uses them)
router.post("/:workspaceId/invite", workspaceController.inviteMember);
router.post("/:workspaceId/accept-invite", workspaceController.acceptInvite);
router.post("/:workspaceId/decline-invite", workspaceController.declineInvite);
router.post("/:workspaceId/remove-member", workspaceController.removeMember);
router.patch("/:workspaceId/members/role", workspaceController.updateMemberRole);

// Rooms
router.use("/:workspaceId/rooms", roomRouter);

// Conversations (DMs)
router.use("/:workspaceId/conversations", conversationRouter);

export default router;
