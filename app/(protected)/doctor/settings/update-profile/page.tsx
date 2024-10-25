import UserProfileEditForm from "@/components/protected/settings/editProfile/EditProfile";
import { currentUser } from "@/lib/auth";

async function DoctorEditProfilePage() {
  const user = await currentUser();

  if (!user) return;

  return (
    <div>
      <UserProfileEditForm isPatient={false} user={user} />
    </div>
  );
}

export default DoctorEditProfilePage;