import { UserModel } from "./user.model";
import { logger } from "../../utils/logger";

export const updateLastSeen = async (userId: string) => {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      lastSeenAt: new Date(),
    });
  } catch (error) {
    logger.error(`[UserService] Error updating lastSeenAt for user ${userId}:`, error);
  }
};

/**
 * Search users by name or username
 */
export const searchUsers = async (query: string) => {
  const searchRegex = new RegExp(query, "i");
  return UserModel.find({
    $or: [
      { name: searchRegex },
      { username: searchRegex },
      { email: searchRegex }
    ]
  })
  .select("name username email avatarUrl displayName lastSeenAt")
  .limit(20)
  .lean();
};
