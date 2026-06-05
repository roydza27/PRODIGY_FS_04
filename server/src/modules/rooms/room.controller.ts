import type { Response } from "express";
import { ZodError } from "zod";
import * as roomService from "./room.service";
import {
  createRoomSchema,
  updateRoomSchema,
} from "./room.validation";
import type { AuthRequest } from "../../types/express";

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const payload = createRoomSchema.parse(req.body);
    const room = await roomService.createRoom(userId, workspaceId, payload);

    return res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    const rooms = await roomService.getWorkspaceRooms(userId, workspaceId);

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

export const getRoom = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const workspaceId = req.params.workspaceId as string;
    const roomId = req.params.roomId as string;
    if (!workspaceId || !roomId) {
      return res.status(400).json({ error: "Workspace ID and Room ID are required" });
    }

    const room = await roomService.getRoomById(userId, workspaceId, roomId);

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};

export const updateRoom = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const workspaceId =
      req.params.workspaceId;
    const roomId = req.params.roomId;

    const payload =
      updateRoomSchema.parse(req.body);

    const room =
      await roomService.updateRoom(
        userId,
        workspaceId,
        roomId,
        payload
      );

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error:
          error.issues[0]?.message ??
          "Validation failed",
      });
    }

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to update room",
    });
  }
};

export const deleteRoom = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const workspaceId =
      req.params.workspaceId;
    const roomId = req.params.roomId;

    await roomService.deleteRoom(
      userId,
      workspaceId,
      roomId
    );

    return res.status(200).json({
      success: true,
      message: "Room deleted",
    });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete room",
    });
  }
};