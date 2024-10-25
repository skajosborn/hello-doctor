//

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function createConversation(doctorId: string) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    // Check if conversation already exists
    const existingConversation =
      await db.conversation.findFirst({
        where: {
          AND: [
            {
              userIds: {
                has: user.id,
              },
            },
            {
              userIds: {
                has: doctorId,
              },
            },
          ],
        },
      });

    if (existingConversation) {
      return { conversationId: existingConversation.id };
    }

    // Create new conversation
    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: user.id,
            },
            {
              id: doctorId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // Trigger Pusher event to notify the other user of the new conversation
    newConversation.users.forEach((userr) => {
      if (userr.id !== user.id) {
        pusherServer.trigger(
          userr.id,
          "conversation:new",
          newConversation
        );
      }
    });

    const role = user.role.toLowerCase();

    revalidatePath(`/${role}/messages`);

    return { conversationId: newConversation.id };
  } catch (error) {
    console.error("CREATE_CONVERSATION_ERROR", error);
    throw new Error("Failed to create conversation");
  }
}

export async function deleteConversation(
  conversationId: string
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    // Get conversation before deletion to use for notification
    const existingConversation =
      await db.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          users: true,
        },
      });

    if (!existingConversation) {
      throw new Error("Conversation not found");
    }

    // Delete all messages in the conversation
    await db.message.deleteMany({
      where: {
        conversationId,
      },
    });

    // Delete the conversation
    const deletedConversation =
      await db.conversation.deleteMany({
        where: {
          id: conversationId,
          userIds: {
            hasSome: [user.id],
          },
        },
      });

    // Notify all users about deleted conversation
    existingConversation.users.forEach((userr) => {
      if (userr.id !== user.id) {
        pusherServer.trigger(
          userr.id,
          "conversation:remove",
          existingConversation
        );
      }
    });

    const role = user.role.toLowerCase();

    revalidatePath(`/${role}/messages`);

    return deletedConversation;
  } catch (error) {
    console.error("DELETE_CONVERSATION_ERROR", error);
    throw new Error("Failed to delete conversation");
  }
}

export async function getConversations() {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return [];
    }

    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: user.id,
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    console.error("GET_CONVERSATIONS_ERROR", error);
    return [];
  }
}

export async function markConversationAsRead(
  conversationId: string,
  userId: string
) {
  try {
    // Get all unread messages in the conversation
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          where: {
            NOT: {
              seenIds: {
                has: userId,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return;
    }

    // Mark all messages as seen
    await Promise.all(
      conversation.messages.map((message) =>
        db.message.update({
          where: {
            id: message.id,
          },
          data: {
            seen: {
              connect: {
                id: userId,
              },
            },
          },
        })
      )
    );
  } catch (error) {
    console.error("MARK_CONVERSATION_AS_READ_ERROR", error);
  }
}
