"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { UpdateProfileSchema } from "@/schemas";

export async function updateProfile(formData: FormData) {
  try {
    const validatedFields = UpdateProfileSchema.safeParse({
      name: formData.get("name"),
      avatar: formData.get("avatar"),
      country: formData.get("country"),
      city: formData.get("city"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { name, avatar, country, city } =
      validatedFields.data;

    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    let imageUrl = user.image;

    if (avatar && avatar instanceof File) {
      imageUrl = await uploadImage(avatar);
    }

    // Update user
    await db.user.update({
      where: { id: user.id },
      data: {
        name,
        image: imageUrl,
      },
    });

    if (user.role === UserRole.PATIENT)
      // Update or create patient
      await db.patient.update({
        where: { id: user.patientId },
        data: {
          country,
          city,
        },
      });

    revalidatePath("/");

    return { success: "Profile updated successfully" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

