import { getConversationMessages } from "@/actions/messaging/messaging";
import MobileMessageDetail from "@/components/protected/messaging/MobileMessageDetail";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DoctorChatDetailPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const user = await currentUser();

  if (!user || !user?.id) {
    return null;
  }

  const conversation = await db.conversation.findUnique({
    where: {
      id: params.conversationId,
    },
    include: {
      users: true,
    },
  });

  if (!conversation) {
    redirect("/doctor/messages");
  }

  const otherUser = conversation.users.find(
    (conversationUser) => conversationUser.id !== user.id
  );

  if (!otherUser) {
    redirect("/doctor/messages");
  }

  const messages = await getConversationMessages(
    params.conversationId
  );

  return (
    <MobileMessageDetail
      userType="doctor"
      conversationId={params.conversationId}
      currentUser={user}
      otherUser={otherUser}
      initialMessages={messages}
    />
  );
}
