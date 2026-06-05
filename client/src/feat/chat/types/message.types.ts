export interface Message {
  _id: string;

  workspaceId: string;
  roomId: string;

  senderId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };

  type: "room" | "dm";
  text: string;

  createdAt: string;
  updatedAt: string;
}

export type MessagesResponse = Message[];
