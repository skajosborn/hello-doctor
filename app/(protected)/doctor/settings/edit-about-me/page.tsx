import { currentUser } from "@/lib/auth";
import DoctorAboutForm from "./components/DoctorAboutFrom";

export default async function DoctorAboutMePage() {
  const user = await currentUser();

  if (!user?.doctor) {
    return <p>No doctor profile found.</p>;
  }

  return <DoctorAboutForm doctor={user?.doctor} />;
}
