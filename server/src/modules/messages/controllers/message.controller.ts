import { Request, Response } from "express";

import * as messageService from "../services/message.service";

export const getRoomHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await messageService.getRoomHistory(
      req.params.roomId as string,
      req.user!.userId
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({
      message: String(error),
    });
  }
};

export const getConversationHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const messages =
      await messageService.getConversationHistory(
        req.params.conversationId as string,
        req.user!.userId
      );

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({
      message: String(error),
    });
  }
};

export const searchMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await messageService.searchMessages(
      req.query.q as string,
      req.user!.userId
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({
      message: String(error),
    });
  }
};

export const updateMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const message = await messageService.updateMessage(
      req.params.messageId as string,
      req.user!.userId,
      req.body.text
    );

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({
      message: String(error),
    });
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const message = await messageService.deleteMessage(
      req.params.messageId as string,
      req.user!.userId
    );

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({
      message: String(error),
    });
  }
};

export const getRoomSharedFiles = async (
  req: Request,
  res: Response
) => {
  try {
    const files = await messageService.getSharedFiles(
      "room",
      req.params.roomId as string,
      req.user!.userId
    );
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ message: String(error) });
  }
};

export const getConversationSharedFiles = async (
  req: Request,
  res: Response
) => {
  try {
    const files = await messageService.getSharedFiles(
      "dm",
      req.params.conversationId as string,
      req.user!.userId
    );
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ message: String(error) });
  }
};

export const addReaction = async (
  req: Request,
  res: Response
) => {
  try {
    const { emoji } = req.body;
    if (!emoji) throw "Emoji is required";

    const message = await messageService.addReaction(
      req.params.messageId as string,
      req.user!.userId,
      emoji
    );

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in addReaction:", error);
    res.status(400).json({ message: String(error) });
  }
};

export const clearChat = async (
  req: Request,
  res: Response
) => {
  try {
    const { context, contextId } = req.params;
    if (context !== "room" && context !== "dm") {
      throw "Invalid context";
    }

    await messageService.clearChat(
      context,
      contextId,
      req.user!.userId
    );

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    res.status(400).json({
      message: String(error),
    });
  }
};