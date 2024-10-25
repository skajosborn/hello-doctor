"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/send-mail";
import { UserRole } from "@prisma/client";

export const register = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedFields =
      RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { email, password, name, role, specialization } =
      validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user first
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
      },
    });

    let doctorId = null;
    let patientId = null;

    // If the role is "DOCTOR", create a doctor document and save its ID
    if (role === UserRole.DOCTOR) {
      if (!specialization) {
        console.error(
          "Specialization missing for doctor role"
        );
        return {
          error: "Specialization is required for doctors",
        };
      }

      const doctor = await db.doctor.create({
        data: {
          specialization,
          userId: user.id,
        },
      });

      doctorId = doctor.id;
    }

    // Create a Patient record if the role is "PATIENT"
    if (role === UserRole.PATIENT) {
      const patient = await db.patient.create({
        data: {
          savedDoctors: [],
          userId: user.id,
        },
      });

      patientId = patient.id;
    }

    // Update the user with role, doctorId, and patientId in a single call
    await db.user.update({
      where: { id: user.id },
      data: {
        role,
        doctorId: doctorId, // Will be null if not a doctor
        patientId: patientId, // Will be null if not a patient
      },
    });

    const verificationToken =
      await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent" };
  } catch {
    return {
      error: "An error occurred during registration",
    };
  }
};
