"use server";

import * as z from "zod";

import { DoctorAboutMeSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getDoctorById } from "@/data/doctor";
import { db } from "@/lib/db";

export const editAboutMe = async (
  values: z.infer<typeof DoctorAboutMeSchema>
) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    if (
      dbUser.role === UserRole.DOCTOR &&
      dbUser.doctorId
    ) {
      const dbDoctor = await getDoctorById(dbUser.doctorId);

      if (!dbDoctor) {
        return { error: "Doctor not found" };
      }

      await db.doctor.update({
        where: { id: dbDoctor.id },
        data: values,
      });
    }

    return { success: "Saved Successfully" };
  } catch {
    return { error: "Something went wrong" };
  }
};
