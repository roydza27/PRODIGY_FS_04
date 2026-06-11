export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  iconUrl?: string;
  visibility?: "invite-only" | "public";
}

export interface UpdateWorkspacePayload {
  name?: string;
  description?: string;
  iconUrl?: string;
}

export interface InviteMemberPayload {
  userId?: string;
  email?: string;
  role?: "admin" | "member";
}

export interface UpdateMemberRolePayload {
  role: "owner" | "admin" | "member";
}

export interface RemoveMemberPayload {
  memberId: string;
}

// Basic validation functions
export const validateCreateWorkspace = (data: any): CreateWorkspacePayload => {
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    throw "Workspace name must be at least 2 characters";
  }

  if (data.description && typeof data.description !== "string") {
    throw "Description must be a string";
  }

  if (data.iconUrl && typeof data.iconUrl !== "string") {
    throw "Icon URL must be a string";
  }

  if (data.visibility && !["invite-only", "public"].includes(data.visibility)) {
    throw "Visibility must be 'invite-only' or 'public'";
  }

  return {
    name: data.name.trim(),
    description: data.description?.trim(),
    iconUrl: data.iconUrl?.trim(),
    visibility: data.visibility || "invite-only",
  };
};

export const validateUpdateWorkspace = (data: any): UpdateWorkspacePayload => {
  const result: UpdateWorkspacePayload = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length < 2) {
      throw "Workspace name must be at least 2 characters";
    }
    result.name = data.name.trim();
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      throw "Description must be a string";
    }
    result.description = data.description.trim();
  }

  if (data.iconUrl !== undefined) {
    if (typeof data.iconUrl !== "string") {
      throw "Icon URL must be a string";
    }
    result.iconUrl = data.iconUrl.trim();
  }

  return result;
};

export const validateInviteMember = (data: any): InviteMemberPayload => {
  if (!data.userId && !data.email) {
    throw "User ID or Email is required";
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw "Invalid email format";
    }
  }

  if (data.role && !["admin", "member"].includes(data.role)) {
    throw "Role must be 'admin' or 'member'";
  }

  return {
    userId: data.userId,
    email: data.email?.toLowerCase().trim(),
    role: data.role || "member",
  };
};

export const validateUpdateMemberRole = (data: any): UpdateMemberRolePayload => {
  if (!data.role || !["owner", "admin", "member"].includes(data.role)) {
    throw "Role must be 'owner', 'admin', or 'member'";
  }

  return { role: data.role };
};

export const validateRemoveMember = (data: any): RemoveMemberPayload => {
  if (!data.memberId || typeof data.memberId !== "string") {
    throw "Member ID is required";
  }

  return { memberId: data.memberId };
};
