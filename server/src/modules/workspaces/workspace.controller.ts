import type { Response } from "express";
import * as workspaceService from "./workspace.service";
import { 
  createWorkspaceSchema, 
  inviteMemberSchema, 
  updateMemberRoleSchema, 
  updateWorkspaceSchema 
} from "./workspace.validation";
import type { AuthRequest } from "../../types/express";
import { socketService } from "../../services/socket.service";

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = createWorkspaceSchema.parse(req.body);
    const workspace = await workspaceService.createWorkspace(userId, payload);

    return res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces
 * Get all workspaces for current user
 */
export const getWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const workspaces = await workspaceService.getWorkspacesByUser(userId);

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces/invites
 * Get all pending invites for current user
 */
export const getPendingInvites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const invites = await workspaceService.getPendingInvites(userId);

    return res.status(200).json({
      success: true,
      data: invites,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces/search
 */
export const searchWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const workspaces = await workspaceService.searchWorkspaces(query);

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces/:workspaceId
 * Get workspace details
 */
export const getWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is member
    const isMember = await workspaceService.isUserMember(workspaceId, userId);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    const workspace = await workspaceService.getWorkspace(workspaceId);

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * PATCH /api/workspaces/:workspaceId
 * Update workspace (owner only)
 */
export const updateWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is owner
    const role = await workspaceService.getUserRole(workspaceId, userId);
    if (role !== "owner") {
      return res.status(403).json({ error: "Only owner can update workspace" });
    }

    const payload = updateWorkspaceSchema.parse(req.body);
    const updated = await workspaceService.updateWorkspace(workspaceId, payload);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * DELETE /api/workspaces/:workspaceId
 * Delete workspace (owner only)
 */
export const deleteWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is owner
    const role = await workspaceService.getUserRole(workspaceId, userId);
    if (role !== "owner") {
      return res.status(403).json({ error: "Only owner can delete workspace" });
    }

    await workspaceService.deleteWorkspace(workspaceId);

    return res.status(200).json({
      success: true,
      data: { message: "Workspace deleted successfully" },
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * GET /api/workspaces/:workspaceId/members
 * Get workspace members
 */
export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is member
    const isMember = await workspaceService.isUserMember(workspaceId, userId);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    const members = await workspaceService.getWorkspaceMembers(workspaceId);

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * POST /api/workspaces/:workspaceId/invite
 * Invite a user to workspace (admin+ only)
 */
export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has permission to invite (owner or admin)
    const role = await workspaceService.getUserRole(workspaceId, userId);

    if (!role || !["owner", "admin"].includes(role)) {
      return res.status(403).json({ error: "Only owner or admin can invite members" });
    }

    const payload = inviteMemberSchema.parse(req.body);

    const membership = await workspaceService.inviteMember(
      workspaceId,
      userId,
      payload
    );

    // Notify specific user if possible
    if (membership.userId) {
      socketService.emitToRoom(`user:${membership.userId}`, "workspace:invited", {
        workspaceId,
        invitedBy: userId
      });
    }

    return res.status(201).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * POST /api/workspaces/:workspaceId/accept-invite
 * Accept workspace invite
 */
export const acceptInvite = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const membership = await workspaceService.acceptInvite(workspaceId, userId);

    // Notify workspace members that someone joined
    socketService.emitToRoom(`workspace:${workspaceId}`, "workspace:member-joined", {
      workspaceId,
      userId
    });

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * POST /api/workspaces/:workspaceId/decline-invite
 * Decline workspace invite
 */
export const declineInvite = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await workspaceService.declineInvite(workspaceId, userId);

    return res.status(200).json({
      success: true,
      data: { message: "Invitation declined successfully" },
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

/**
 * DELETE /api/workspaces/:workspaceId/members/:memberId
 * Remove member from workspace (owner/admin only)
 */
export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;
    const memberId = req.params.memberId as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check invoker permission
    const invokerRole = await workspaceService.getUserRole(workspaceId, userId);
    if (!invokerRole || !["owner", "admin"].includes(invokerRole)) {
      return res.status(403).json({ error: "Only owner or admin can remove members" });
    }

    // Target member check
    const targetRole = await workspaceService.getUserRole(workspaceId, memberId);
    if (!targetRole) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Cannot remove owner
    if (targetRole === "owner") {
      return res.status(403).json({ error: "Cannot remove workspace owner" });
    }

    // Admins cannot remove other admins (only owners can)
    if (invokerRole === "admin" && targetRole === "admin") {
      return res.status(403).json({ error: "Admins cannot remove other admins" });
    }

    // Cannot remove yourself accidentally
    if (userId === memberId) {
      return res.status(400).json({ error: "Use leave workspace instead" });
    }

    await workspaceService.removeMember(workspaceId, memberId);

    // Notify workspace and specific user
    socketService.emitToRoom(`workspace:${workspaceId}`, "workspace:member-removed", {
      workspaceId,
      userId: memberId
    });
    socketService.emitToRoom(`user:${memberId}`, "workspace:removed", {
      workspaceId
    });

    return res.status(200).json({
      success: true,
      data: { message: "Member removed successfully" },
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};


/**
 * POST /api/workspaces/:workspaceId/leave
 * User leaves workspace
 */
export const leaveWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check role - owners cannot leave without transferring ownership
    const role = await workspaceService.getUserRole(workspaceId, userId);

    if (!role) {
      return res.status(404).json({ error: "Membership not found" });
    }

    if (role === "owner") {
      return res.status(400).json({ 
        error: "Owners cannot leave the workspace. Transfer ownership or delete the workspace instead." 
      });
    }

    await workspaceService.removeMember(workspaceId, userId);

    // Notify workspace
    socketService.emitToRoom(`workspace:${workspaceId}`, "workspace:member-removed", {
      workspaceId,
      userId
    });

    return res.status(200).json({
      success: true,
      data: { message: "Successfully left the workspace" },
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};


/**
 * PATCH /api/workspaces/:workspaceId/members/:memberId
 * Update member role (owner/admin only)
 */
export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;
    const memberId = req.params.memberId as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role: newRole } = updateMemberRoleSchema.parse(req.body);

    // Get current roles
    const invokerRole = await workspaceService.getUserRole(workspaceId, userId);
    const targetRole = await workspaceService.getUserRole(workspaceId, memberId);

    if (!invokerRole) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!targetRole) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Owners can do anything (except demote themselves without transferring ownership)
    if (invokerRole === "owner") {
      if (userId === memberId && newRole !== "owner") {
        return res.status(400).json({ error: "Transfer ownership before changing your role" });
      }
    } 
    // Admins can manage Member roles
    else if (invokerRole === "admin") {
      // Cannot manage Owner
      if (targetRole === "owner") {
        return res.status(403).json({ error: "Cannot modify Owner role" });
      }
      // Cannot promote to Owner
      if (newRole === "owner") {
        return res.status(403).json({ error: "Only Owner can promote to Owner" });
      }
      // Cannot manage other Admins
      if (targetRole === "admin") {
        return res.status(403).json({ error: "Only Owner can modify Admin roles" });
      }
    } else {
      return res.status(403).json({ error: "Only Owner or Admin can manage roles" });
    }

    const membership = await workspaceService.updateMemberRole(
      workspaceId,
      memberId,
      newRole
    );

    // Notify workspace
    socketService.emitToRoom(`workspace:${workspaceId}`, "workspace:member-updated", {
      workspaceId,
      userId: memberId,
      role: newRole
    });

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};
