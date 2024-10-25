"use server";

import bcrypt from "bcryptjs";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { passwordChangeSchema } from "@/schemas";
import * as z from "zod";

export const passwordChange = async (
  values: z.infer<typeof passwordChangeSchema>
) => {
  try {
    const validatedFields =
      passwordChangeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { password, newPassword } = validatedFields.data;

    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    // Ensure the user's password is not null
    if (!dbUser.password) {
      return {
        error: "User does not have a password set!",
      };
    }

    if (password && newPassword) {
      const passwordsMatch = await bcrypt.compare(
        password,
        dbUser.password
      );

      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      await db.user.update({
        where: { id: dbUser.id },
        data: {
          password: hashedPassword,
        },
      });
    }

    return {
      success: "Your password was changed successfully",
    };
  } catch {
    return { error: "Something went wrong!" };
  }
};
