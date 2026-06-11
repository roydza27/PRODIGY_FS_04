import { Request, Response } from "express";
import * as conversationService from "./conversation.service";
import { logger } from "../../utils/logger";
import { AuthRequest } from "../../types/express";

export const getOrCreateDM = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const { participantId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    const conversation = await conversationService.getOrCreateDM(
      workspaceId,
      userId,
      participantId
    );

    res.json(conversation);
  } catch (error: unknown) {
    logger.error("Error in getOrCreateDM:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(400).json({ message });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversations = workspaceId 
      ? await conversationService.getUserConversations(workspaceId, userId)
      : await conversationService.getAllUserConversations(userId);

    res.json(conversations);
  } catch (error: unknown) {
    logger.error("Error in getConversations:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    res.status(400).json({ message });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId as string;

    const conversation = await conversationService.getConversation(conversationId);

    res.json(conversation);
  } catch (error: unknown) {
    logger.error("Error in getConversation:", error);
    const message = error instanceof Error ? error.message : "Conversation not found";
    res.status(404).json({ message });
  }
};
