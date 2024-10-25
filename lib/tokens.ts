import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateVerificationToken = async (
  email: string
) => {
  // Generate a token and set expiration time (15 minutes from now)
  const token = uuidv4();
  const expires = new Date(
    new Date().getTime() + 15 * 60 * 1000
  ); // 15 minutes;

  const existingToken = await getVerificationTokenByEmail(
    email
  );

  if (existingToken) {
    // Delete the existing token
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create a new verification token
  const verificationToken =
    await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

  return verificationToken;
};

export const generatePasswordResetToken = async (
  email: string
) => {
  const token = uuidv4();
  const expires = new Date(
    new Date().getTime() + 15 * 60 * 1000
  ); // 15 minutes;

  const existingToken = await getPasswordResetTokenByEmail(
    email
  );

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken =
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (
  email: string
) => {
  const token = crypto
    .randomInt(100_000, 1_000_000)
    .toString();

  const expires = new Date(
    new Date().getTime() + 15 * 60 * 1000
  ); // 15 minutes;

  const existingToken = await getTwoFactorTokenByEmail(
    email
  );

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};