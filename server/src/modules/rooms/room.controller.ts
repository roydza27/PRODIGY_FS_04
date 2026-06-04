import type { Response } from "express";
import * as roomService from "./room.service";
import { createRoomSchema } from "./room.validation";
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
