import type { IWorkspace, CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.types";
import { WorkspaceModel } from "./workspace.model";
import { MembershipModel } from "./membership.model";

export const findWorkspaceById = async (workspaceId: string): Promise<IWorkspace | null> => {
  return WorkspaceModel.findById(workspaceId).lean();
};

export const findWorkspaceBySlug = async (slug: string): Promise<IWorkspace | null> => {
  return WorkspaceModel.findOne({ slug }).lean();
};

export const findWorkspacesByMemberUserId = async (
  userId: string,
  status: "active" | "archived" | "all" = "active"
): Promise<IWorkspace[]> => {
  const query: Record<string, any> = { userId };

  if (status !== "all") {
    query.status = status;
  }

  const memberships = await MembershipModel.find(query)
    .populate("workspaceId")
    .lean();

  return memberships
    .map((m) => m.workspaceId as unknown as IWorkspace)
    .filter(Boolean);
};

export const findWorkspacesByUserId = async (
  userId: string,
  status: "active" | "archived" | "all" = "active"
): Promise<IWorkspace[]> => {
  const query: Record<string, any> = { ownerId: userId };

  if (status !== "all") {
    query.status = status;
  }

  return WorkspaceModel.find(query).sort({ createdAt: -1 }).lean();
};

export const createWorkspace = async (
  userId: string,
  input: CreateWorkspaceInput,
  slug: string
): Promise<IWorkspace> => {
  const workspace = await WorkspaceModel.create({
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || "",
    iconUrl: input.iconUrl?.trim() || "",
    ownerId: userId,
    visibility: input.visibility || "invite-only",
    status: "active",
    memberCount: 1,
    roomCount: 1,
  });

  return workspace.toObject();
};

export const updateWorkspace = async (
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<IWorkspace | null> => {
  const updateData: Record<string, any> = {};

  if (input.name !== undefined) {
    updateData.name = input.name.trim();
  }
  if (input.description !== undefined) {
    updateData.description = input.description.trim();
  }
  if (input.iconUrl !== undefined) {
    updateData.iconUrl = input.iconUrl.trim();
  }

  return WorkspaceModel.findByIdAndUpdate(workspaceId, updateData, {
    new: true,
  }).lean();
};


export const incrementRoomCount = async (workspaceId: string): Promise<void> => {
  await WorkspaceModel.updateOne(
    { _id: workspaceId },
    { $inc: { roomCount: 1 } }
  );
};

export const recalculateMemberCount = async (
  workspaceId: string
): Promise<void> => {
  const count = await MembershipModel.countDocuments({
    workspaceId,
    status: "active",
  });

  await WorkspaceModel.updateOne(
    { _id: workspaceId },
    {
      memberCount: Math.max(1, count),
    }
  );
};

export const decrementRoomCount = async (workspaceId: string): Promise<void> => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    return;
  }

  workspace.roomCount = Math.max(1, workspace.roomCount - 1);
  await workspace.save();
};

export const archiveWorkspace = async (workspaceId: string): Promise<IWorkspace | null> => {
  return WorkspaceModel.findByIdAndUpdate(
    workspaceId,
    {
      status: "archived",
      archivedAt: new Date(),
    },
    { new: true }
  ).lean();
};