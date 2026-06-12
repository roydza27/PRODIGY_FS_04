import type {
  IMembership,
  CreateMembershipInput,
  UpdateMembershipInput,
} from "./membership.types";
import { MembershipModel } from "./membership.model";

export const findMembershipById = async (membershipId: string): Promise<IMembership | null> => {
  return MembershipModel.findById(membershipId).lean();
};

export const findMembership = async (
  workspaceId: string,
  userId: string
): Promise<IMembership | null> => {
  return MembershipModel.findOne({ workspaceId, userId }).lean();
};

export const checkMembershipExists = async (
  workspaceId: string,
  userId: string
): Promise<boolean> => {
  return MembershipModel.exists({ workspaceId, userId, status: "active" }).then(Boolean);
};

export const findWorkspaceMembers = async (
  workspaceId: string,
  status: "all" | "active" | "invited" = "active"
): Promise<IMembership[]> => {
  const query: Record<string, unknown> = { workspaceId };

  if (status !== "all") {
    query.status = status;
  }

  return MembershipModel.find(query)
    .populate("userId", "name username email avatarUrl displayName lastSeenAt")
    .sort({ createdAt: 1 })
    .lean();
};

export const findUserWorkspaces = async (
  userId: string,
  status: "all" | "active" | "invited" = "active"
): Promise<IMembership[]> => {
  const query: Record<string, unknown> = { userId };

  if (status !== "all") {
    query.status = status;
  }

  return MembershipModel.find(query)
    .populate("workspaceId", "name slug description iconUrl memberCount")
    .sort({ createdAt: -1 })
    .lean();
};

export const createMembership = async (
  input: CreateMembershipInput
): Promise<IMembership> => {
  const membership = await MembershipModel.create({
    workspaceId: input.workspaceId,
    userId: input.userId,
    role: input.role || "member",
    status: input.status || "invited",
    invitedBy: input.invitedBy || null,
    invitedAt: input.status === "invited" ? new Date() : null,
    joinedAt: input.status === "active" ? new Date() : null,
    nickname: input.nickname?.trim() || "",
  });

  return membership.toObject();
};

export const updateMembership = async (
  membershipId: string,
  input: UpdateMembershipInput
): Promise<IMembership | null> => {
  const updateData: Record<string, unknown> = {};

  if (input.role !== undefined) {
    updateData.role = input.role;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;

    if (input.status === "active") {
      updateData.joinedAt = new Date();
    } else if (input.status === "removed" || input.status === "blocked") {
      updateData.removedAt = new Date();
    }
  }

  if (input.nickname !== undefined) {
    updateData.nickname = input.nickname.trim();
  }

  return MembershipModel.findByIdAndUpdate(membershipId, updateData, {
    new: true,
  }).lean();
};

export const updateMembershipByUserAndWorkspace = async (
  workspaceId: string,
  userId: string,
  input: UpdateMembershipInput
): Promise<IMembership | null> => {
  const updateData: Record<string, unknown> = {};

  if (input.role !== undefined) {
    updateData.role = input.role;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;

    if (input.status === "active") {
      updateData.joinedAt = new Date();
    } else if (input.status === "removed" || input.status === "blocked") {
      updateData.removedAt = new Date();
    }
  }

  if (input.nickname !== undefined) {
    updateData.nickname = input.nickname.trim();
  }

  return MembershipModel.findOneAndUpdate(
    { workspaceId, userId },
    updateData,
    { new: true }
  ).lean();
};

export const removeMembership = async (
  workspaceId: string,
  userId: string
): Promise<IMembership | null> => {
  return MembershipModel.findOneAndUpdate(
    { workspaceId, userId },
    {
      status: "removed",
      removedAt: new Date(),
    },
    { new: true }
  ).lean();
};

export const getUserRoleInWorkspace = async (
  workspaceId: string,
  userId: string
): Promise<"owner" | "admin" | "member" | null> => {
  const membership = await MembershipModel.findOne(
    { workspaceId, userId, status: "active" },
    { role: 1 }
  ).lean<{ role?: "owner" | "admin" | "member" }>();

  return membership?.role || null;
};

export const countWorkspaceMembers = async (workspaceId: string): Promise<number> => {
  return MembershipModel.countDocuments({ workspaceId, status: "active" });
};

export const deleteAllWorkspaceMemberships = async (workspaceId: string): Promise<void> => {
  await MembershipModel.deleteMany({ workspaceId });
};

export const updateLastReadAt = async (
  workspaceId: string,
  userId: string,
  roomId: string
): Promise<void> => {
  await MembershipModel.updateOne(
    { workspaceId, userId, status: "active" },
    { $set: { [`roomLastRead.${roomId}`]: new Date() } }
  ).exec();
};