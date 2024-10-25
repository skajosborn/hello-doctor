import { db } from "@/lib/db";

export const getDoctorById = async (id: string) => {
  try {
    const doctor = await db.doctor.findUnique({
      where: {
        id,
      },
    });

    return doctor;
  } catch {
    return null;
  }
};