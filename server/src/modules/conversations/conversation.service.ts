import * as conversationRepository from "./conversation.repository";
import * as membershipRepository from "../workspaces/membership.repository";
import type { IConversation, IPopulatedConversation } from "./conversation.types";

export const getOrCreateDM = async (
  workspaceId: string,
  userId: string,
  participantId: string
): Promise<IPopulatedConversation | IConversation> => {
  // 1. Validate both users are members of the workspace
  const [userIsMember, participantIsMember] = await Promise.all([
    membershipRepository.checkMembershipExists(workspaceId, userId),
    membershipRepository.checkMembershipExists(workspaceId, participantId),
  ]);

  if (!userIsMember || !participantIsMember) {
    throw new Error("One or both users are not members of this workspace");
  }

  // 2. Check if DM already exists
  const conversation = await conversationRepository.findDM(
    workspaceId,
    userId,
    participantId
  );

  // 3. Create if not exists
  if (!conversation) {
    const newConversation = await conversationRepository.createConversation(workspaceId, [
      userId,
      participantId,
    ]);
    
    // Populate participants for the newly created conversation
    return await conversationRepository.findConversationById(newConversation._id.toString()) as unknown as IPopulatedConversation;
  }

  return conversation;
};

export const getUserConversations = async (workspaceId: string, userId: string) => {
  return conversationRepository.findUserConversations(workspaceId, userId);
};

export const getAllUserConversations = async (userId: string) => {
  return conversationRepository.findAllUserConversations(userId);
};

export const getConversation = async (conversationId: string) => {
  const conversation = await conversationRepository.findConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  return conversation;
};
