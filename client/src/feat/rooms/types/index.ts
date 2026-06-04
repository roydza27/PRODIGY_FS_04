export interface Room {
  _id: string;
  workspaceId: string;
  name: string;
  description: string;
  type: "text" | "voice";
  isPrivate: boolean;
  createdBy: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  type?: "text" | "voice";
  isPrivate?: boolean;
}
