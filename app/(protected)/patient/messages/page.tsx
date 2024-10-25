import MobileMessageList from "@/components/protected/messaging/MobileMessageList";
import { currentUser } from "@/lib/auth";

export default async function PatientChatsPage() {
  const user = await currentUser();

  if (!user || !user?.id) {
    return null;
  }

  return (
    <MobileMessageList
      userType="patient"
      currentUserId={user.id}
    />
  );
}
