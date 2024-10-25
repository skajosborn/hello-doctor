import { useSession } from "next-auth/react";

import { ExtendedUser } from "@/next-auth";

export const useCurrentUser = ():
  | ExtendedUser
  | undefined => {
  const session = useSession();

  return session.data?.user;
};
