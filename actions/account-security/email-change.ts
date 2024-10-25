"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { emailChangeSchema } from "@/schemas";
import * as z from "zod";

export const emailChange = async (
  value: z.infer<typeof emailChangeSchema>
) => {
  try {
    const validatedField =
      emailChangeSchema.safeParse(value);

    if (!validatedField.success) {
      return { error: "Invalid email address" };
    }

    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    const newEmail = validatedField.data.email;

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    if (newEmail === dbUser.email) {
      return {
        error:
          "New email must be different from the current one",
      };
    }

    const existingUser = await getUserByEmail(newEmail);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        email: newEmail,
      },
    });

    return {
      success: "You changed your email successfully!",
    };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
