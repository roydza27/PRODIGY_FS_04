import * as conversationRepository from "./conversation.repository";
import * as membershipRepository from "../workspaces/membership.repository";

export const getOrCreateDM = async (
  workspaceId: string,
  userId: string,
  participantId: string
) => {
  // 1. Validate both users are members of the workspace
  const [userIsMember, participantIsMember] = await Promise.all([
    membershipRepository.checkMembershipExists(workspaceId, userId),
    membershipRepository.checkMembershipExists(workspaceId, participantId),
  ]);

  if (!userIsMember || !participantIsMember) {
    throw new Error("One or both users are not members of this workspace");
  }

  // 2. Check if DM already exists
  let conversation = await conversationRepository.findDM(
    workspaceId,
    userId,
    participantId
  );

  // 3. Create if not exists
  if (!conversation) {
    conversation = await conversationRepository.createConversation(workspaceId, [
      userId,
      participantId,
    ]);
    
    // Populate participants for the newly created conversation
    conversation = await conversationRepository.findConversationById(conversation._id.toString()) as any;
  }

  return conversation;
};

export const getUserConversations = async (workspaceId: string, userId: string) => {
  return conversationRepository.findUserConversations(workspaceId, userId);
};

export const getConversation = async (conversationId: string) => {
  const conversation = await conversationRepository.findConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  return conversation;
};
