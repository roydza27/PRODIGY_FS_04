import { io, Socket } from "socket.io-client";
import type { IAttachment, MessageContentType } from "@/feat/chat/types/message.types";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ??
  "http://localhost:5000";

export interface SendMessagePayload {
  workspaceId?: string;
  roomId?: string;
  conversationId?: string;
  text: string;
  messageType?: MessageContentType;
  attachments?: IAttachment[];
  replyTo?: string;
}

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });

    if (import.meta.env.DEV) {
      this.socket.on(
        "connect_error",
        (error) => {
          console.error(
            "[Socket] Connection Error:",
            error
          );
        }
      );
    }
  }

  connect(token: string) {
    this.socket.auth = { token };

    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  isConnected() {
    return this.socket.connected;
  }

  getSocket() {
    return this.socket;
  }

  emit(
    event: string,
    payload?: unknown
  ) {
    this.socket.emit(event, payload);
  }

  joinWorkspace(workspaceId: string) {
    this.emit("workspace:join", {
      workspaceId,
    });
  }

  leaveWorkspace(workspaceId: string) {
    this.emit("workspace:leave", {
      workspaceId,
    });
  }

  joinRoom(
    workspaceId: string,
    roomId: string
  ) {
    this.emit("room:join", {
      workspaceId,
      roomId,
    });
  }

  leaveRoom(roomId: string) {
    this.emit("room:leave", {
      roomId,
    });
  }

  joinDM(
    workspaceId: string,
    conversationId: string
  ) {
    this.emit("dm:join", {
      workspaceId,
      conversationId,
    });
  }

  leaveDM(conversationId: string) {
    this.emit("dm:leave", {
      conversationId,
    });
  }

  markDMDelivered(messageId: string, conversationId: string) {
    this.emit("dm:delivered", {
      messageId,
      conversationId,
    });
  }

  markDMSeen(conversationId: string) {
    this.emit("dm:seen", {
      conversationId,
    });
  }

  markRoomSeen(workspaceId: string, roomId: string) {
    this.emit("room:seen", {
      workspaceId,
      roomId,
    });
  }

  sendMessage(
    payload: SendMessagePayload
  ) {
    if (!this.socket.connected) {
      return;
    }

    this.emit(
      "message:send",
      payload
    );
  }

  on<T = unknown>(
    event: string,
    callback: (data: T) => void
  ) {
    this.socket.on(event, callback);
  }

  off<T = unknown>(
    event: string,
    callback: (data: T) => void
  ) {
    this.socket.off(event, callback);
  }

  once<T = unknown>(
    event: string,
    callback: (data: T) => void
  ) {
    this.socket.once(event, callback);
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.socket.removeAllListeners(
        event
      );
      return;
    }

    this.socket.removeAllListeners();
  }
}

export const socketService =
  new SocketService();