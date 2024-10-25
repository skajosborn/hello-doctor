"use server";

import { db } from "@/lib/db";

export async function getDoctors() {
  try {
    const doctors = await db.doctor.findMany({
      select: {
        id: true,
        user: true,
        specialization: true,
      },
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user?.name ?? 'Unknown',
      email: doctor.user?.email ?? 'No email provided',
      user: doctor.user,
      specialization: doctor.specialization,
    }));
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}

