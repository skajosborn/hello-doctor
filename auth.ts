import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { db } from "./lib/db";
import { getAccountByUserId } from "./data/account";
import { getDoctorById } from "./data/doctor";
import { Doctor, Patient } from "./next-auth";
import { UserRole } from "@prisma/client";
import { getPatientById } from "./data/patient";

export const { handlers, auth, signIn, signOut } = NextAuth(
  {
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
      newUser: "/auth/role-selection",
    },
    events: {
      async linkAccount({ user }) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      },
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // If the sign-in provider is OAuth
        if (account && account.provider !== "credentials") {
          const email = profile?.email;

          if (email) {
            const existingUser = await db.user.findUnique({
              where: { email },
            });

            // If email exists in the database but the provider is different
            if (existingUser) {
              const isCloudinaryImage =
                existingUser.image?.includes(
                  "res.cloudinary.com"
                );

              // If the user already has a Cloudinary image, don't overwrite it with the OAuth image
              if (isCloudinaryImage) {
                user.image = existingUser.image;
              } else {
                // If the image was from a previous OAuth provider, allow the new provider to update the image
                user.image = profile?.picture;
              }

              // Check if the user is trying to sign in with a different OAuth provider
              const existingAccount =
                await db.account.findFirst({
                  where: {
                    userId: existingUser.id,
                    provider: account.provider,
                  },
                });

              // If the user has already signed in with this provider, proceed
              if (existingAccount) {
                return true;
              }

              return `/auth/error?error=EmailExists`;
            } else {
              // No existing user found with the email, allow sign in and create a new user
              return true;
            }
          }
        }

        if (!user.id) {
          return false;
        }

        const existingUser = await getUserById(user.id);

        //Prevent sign in without email verification`
        if (!existingUser?.emailVerified) return false;

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation =
            await getTwoFactorConfirmationByUserId(
              existingUser.id
            );

          if (!twoFactorConfirmation) return false;

          // Delete two factor confirmation for next sign in
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }

        return true;
      },
      async jwt({ token }) {
        if (!token.sub) return token;

        const user = await getUserById(token.sub);

        if (!user) return token;

        const existingAccount = await getAccountByUserId(
          user.id
        );

        token.isOAuth = !!existingAccount;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;
        token.image = user.image;

        // Add doctor information if the user is a doctor
        if (
          user.role === UserRole.DOCTOR &&
          user.doctorId
        ) {
          const doctor = await getDoctorById(user.doctorId);

          if (doctor) {
            token.doctorId = user.doctorId;
            token.doctor = doctor;
          }
        }

        // Add patient information if the user is a patient
        if (
          user.role === UserRole.PATIENT &&
          user.patientId
        ) {
          const patient = await getPatientById(
            user.patientId
          );

          if (patient) {
            token.patientId = user.patientId;
            token.patient = patient;
          }
        }

        return token;
      },
      async session({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        if (session.user) {
          session.user.name = token.name;
          session.user.email = token.email as string;
          session.user.role = token.role as UserRole;
          session.user.isTwoFactorEnabled =
            token.isTwoFactorEnabled as boolean;
          session.user.image = token.image as string;
          session.user.isOAuth = token.isOAuth as boolean;
          session.user.image = token.image as string;
        }

        // Add the doctor info if available
        if (token.doctor) {
          session.user.doctor = token.doctor as Doctor;
          session.user.doctorId = token.doctorId as string;
        }

        // Add the patient info if available
        if (token.patient) {
          session.user.patient = token.patient as Patient;
          session.user.patientId =
            token.patientId as string;
        }

        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    trustHost: true,
    ...authConfig,
  }
);
