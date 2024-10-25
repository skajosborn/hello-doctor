import MobileMessageDetail from "@/components/protected/messaging/MobileMessageDetail";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getConversationMessages } from "@/actions/messaging/messaging";
import { currentUser } from "@/lib/auth";

export default async function PatientChatDetailPage({
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
    redirect("/patient/messages");
  }

  const otherUser = conversation.users.find(
    (conversationUser) => conversationUser.id !== user.id
  );

  if (!otherUser) {
    redirect("/patient/messages");
  }

  const messages = await getConversationMessages(
    params.conversationId
  );

  return (
    <MobileMessageDetail
      userType="patient"
      conversationId={params.conversationId}
      currentUser={user}
      otherUser={otherUser}
      initialMessages={messages}
    />
  );
}
