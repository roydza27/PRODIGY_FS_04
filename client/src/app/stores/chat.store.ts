import { create } from "zustand";
import type { Message } from "../feat/chat/types/message.types";

interface ChatState {
  replyTo: Message | null;
  setReplyTo: (message: Message | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  replyTo: null,
  setReplyTo: (message) => set({ replyTo: message }),
}));
