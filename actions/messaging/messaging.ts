"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function sendMessage({
  message,
  image,
  conversationId,
}: {
  message?: string;
  image?: string;
  conversationId: string;
}) {
  try {
    const user = await currentUser();

    if (!user?.id || !user?.email) {
      throw new Error("Unauthorized");
    }

    const newMessage = await db.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: user.id },
        },
        seen: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const updatedConversation =
      await db.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
        include: {
          users: true,
          messages: {
            include: {
              seen: true,
              sender: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      });

    // Notify conversation channel about new message
    await pusherServer.trigger(
      conversationId,
      "messages:new",
      newMessage
    );

    // Notify each user about the conversation update
    for (const user of updatedConversation.users) {
      await pusherServer.trigger(
        user.id,
        "conversation:update",
        {
          id: conversationId,
          messages: updatedConversation.messages,
          lastMessageAt: updatedConversation.lastMessageAt,
          users: updatedConversation.users,
        }
      );
    }

    const role = user.role.toLowerCase();
    revalidatePath(`/${role}/messages/${conversationId}`);
    revalidatePath(`/${role}/messages`);

    return newMessage;
  } catch (error) {
    console.error("SEND_MESSAGE_ERROR", error);
    throw new Error("Failed to send message");
  }
}

export async function getConversationMessages(
  conversationId: string
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const messages = await db.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error) {
    console.error("GET_MESSAGES_ERROR", error);
    return [];
  }
}
