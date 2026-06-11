export interface Room {
  _id: string;
  workspaceId: string;
  name: string;
  description: string;
  type: "text" | "voice";
  isPrivate: boolean;
  memberCount?: number;
  createdBy: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomPayload {
  workspaceId: string;
  name: string;
  description?: string;
  type?: "text" | "voice";
  isPrivate?: boolean;
}

export interface UpdateRoomPayload {
  workspaceId: string;
  roomId: string;

  name?: string;
  description?: string;

  type?: "text" | "voice";
  isPrivate?: boolean;
}

export interface RoomsResponse {
  success: boolean;
  data: Room[];
}

export interface RoomResponse {
  success: boolean;
  data: Room;
}