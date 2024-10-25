import Settings from "@/components/protected/settings/settings";
import { currentUser } from "@/lib/auth";
import DeleteAccountButton from "@/components/protected/settings/DeleteAccount"; // Import the button

const PatientSettings = async () => {
  const user = await currentUser();

  const patientLinks = [
    {
      href: "/patient/settings/update-profile",
      label: "Update Profile",
    },
    {
      href: "/patient/settings/change-location",
      label: "Change Location",
    },
  ];

  // Conditionally insert "Account Security" before "Delete Account"
  if (!user?.isOAuth) {
    patientLinks.splice(2, 0, {
      href: "/patient/settings/account-security",
      label: "Account Security",
    });
  }

  return (
    <div>
      <Settings links={patientLinks} />
      <DeleteAccountButton />
    </div>
  );
};

export default PatientSettings;
