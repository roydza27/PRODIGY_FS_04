import { Request, Response } from "express";
import * as conversationService from "./conversation.service";
import { logger } from "../../utils/logger";

export const getOrCreateDM = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { participantId } = req.body;
    const userId = (req as any).user.id;

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    const conversation = await conversationService.getOrCreateDM(
      workspaceId,
      userId,
      participantId
    );

    res.json(conversation);
  } catch (error: any) {
    logger.error("Error in getOrCreateDM:", error);
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const userId = (req as any).user.id;

    const conversations = await conversationService.getUserConversations(
      workspaceId,
      userId
    );

    res.json(conversations);
  } catch (error: any) {
    logger.error("Error in getConversations:", error);
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversation = await conversationService.getConversation(conversationId);

    res.json(conversation);
  } catch (error: any) {
    logger.error("Error in getConversation:", error);
    res.status(404).json({ message: error.message || "Conversation not found" });
  }
};
