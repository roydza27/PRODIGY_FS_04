import { Request, Response } from "express";
import { presenceService } from "../../sockets/presence.service";

export const getOnlineUsers = (_req: Request, res: Response) => {
  const onlineUserIds = presenceService.getOnlineUserIds();
  
  res.json({
    success: true,
    data: onlineUserIds,
  });
};
