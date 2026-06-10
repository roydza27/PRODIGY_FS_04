import { Request, Response } from "express";
import * as userService from "./user.service";

/**
 * GET /api/users/search
 */
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const users = await userService.searchUsers(query);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ error: String(error) });
  }
};
