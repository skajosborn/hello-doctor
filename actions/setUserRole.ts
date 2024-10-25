"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function setUserRole(
  role: UserRole,
  specialization: string
) {
  try {
    const session = await currentUser();

    if (!session || !session.id) {
      throw new Error("Unauthorized");
    }

    if (
      role !== UserRole.PATIENT &&
      role !== UserRole.DOCTOR
    ) {
      throw new Error("Invalid role");
    }

    const user = await getUserById(session?.id);
    if (!user) {
      throw new Error("User not found");
    }

    user.role = role;

    let doctorId;
    let patientId;

    if (role === UserRole.DOCTOR) {
      if (!specialization) {
        throw new Error(
          "Specialization is required for doctors"
        );
      }

      // Create a new doctor profile and set userId
      const doctor = await db.doctor.create({
        data: {
          specialization,
          userId: user.id,
        },
      });

      doctorId = doctor.id;
    }

    // Create a Patient record and set userId
    if (role === UserRole.PATIENT) {
      const patient = await db.patient.create({
        data: {
          savedDoctors: [],
          userId: user.id,
        },
      });

      patientId = patient.id;
    }

    // Update user role, doctorId, and patientId
    await db.user.update({
      where: { id: user.id },
      data: {
        role,
        doctorId: doctorId, // Will be null if not a doctor
        patientId: patientId, // Will be null if not a patient
      },
    });

    return {
      success: `Role successfully set to '${role}'.`,
    };
  } catch {
    return {
      error: `An unexpected error occurred. Please try again.`,
    };
  }
}
