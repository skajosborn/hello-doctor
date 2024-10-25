import { TwoFactorAuth } from "@/components/protected/settings/accountSecurity/TwoFactorAuth";
import { EmailChangeForm } from "@/components/protected/settings/accountSecurity/EmailChangeForm";
import { PasswordChangeForm } from "@/components/protected/settings/accountSecurity/PasswordChangeForm";
import { currentUser } from "@/lib/auth";

const PatientAccountSecurityPage = async () => {
  const user = await currentUser();

  if (!user) return;

  return (
    <div className="space-y-8 p-6 bg-bgLight text-textDark">
      <TwoFactorAuth user={user} />
      <EmailChangeForm user={user} />
      <PasswordChangeForm />
    </div>
  );
};

export default PatientAccountSecurityPage;