import { currentUser } from "@/lib/auth";
import MobileDrawer from "./MobileDrawer";

export default async function MobileDrawerContainer() {
  const user = await currentUser();

  return <MobileDrawer user={user} />;
}
