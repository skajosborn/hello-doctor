import { db } from "@/lib/db";

export const getPatientById = async (id: string) => {
  try {
    const patient = await db.patient.findUnique({
      where: {
        id,
      },
    });

    return patient;
  } catch {
    return null;
  }
};
