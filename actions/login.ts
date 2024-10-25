"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import {
  DOCTOR_LOGIN_REDIRECT,
  PATIENT_LOGIN_REDIRECT,
} from "@/routes";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@/lib/send-mail";

import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";

export const login = async (
  values: z.infer<typeof LoginSchema>
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { error: "Email does not exist" };
    }

    if (!user.password) {
      return {
        error:
          "This account was created with Google Sign-In. Please log in using Google.",
      };
    }

    if (!user.email) {
      return {
        error: "Email is missing from the user profile",
      };
    }

    if (!user.emailVerified) {
      const verificationToken =
        await generateVerificationToken(user.email);

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: "Confirmation email sent!" };
    }

    if (user.isTwoFactorEnabled) {
      if (code) {
        const twoFactorToken =
          await getTwoFactorTokenByEmail(user.email);
        if (
          !twoFactorToken ||
          twoFactorToken.token !== code
        ) {
          return { error: "Invalid code!" };
        }
        if (new Date(twoFactorToken.expires) < new Date()) {
          return { error: "Code expired!" };
        }

        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });

        const existingConfirmation =
          await getTwoFactorConfirmationByUserId(user.id);
        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          });
        }
        await db.twoFactorConfirmation.create({
          data: { userId: user.id },
        });

        // return await attemptSignIn(email, password);
      } else {
        const twoFactorToken = await generateTwoFactorToken(
          user.email
        );
        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token
        );
        return { twoFactor: true };
      }
    }

    const redirectTo =
      user.role === "DOCTOR"
        ? DOCTOR_LOGIN_REDIRECT
        : PATIENT_LOGIN_REDIRECT;

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });

    return { success: "Login successful!" };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw err;
  }
};
