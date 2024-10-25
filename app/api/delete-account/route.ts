import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    // Check if the user is authenticated
    const user = await currentUser();
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: "User not authenticated or wrong userId" },
        { status: 401 }
      );
    }

    const userRecord = await db.user.findUnique({
      where: { id: userId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Start a transaction to ensure all deletions happen atomically
    await db.$transaction(async (prisma) => {
      // Delete all appointments associated with the user first
      if (userRecord.doctor?.length > 0) {
        await prisma.appointment.deleteMany({
          where: { doctorId: userRecord.doctor[0].id },
        });
      }

      await prisma.appointment.deleteMany({
        where: { userId: userId },
      });

      // Delete messages and conversation relationships
      await prisma.message.deleteMany({
        where: { senderId: userId },
      });

      await prisma.conversation.updateMany({
        where: { userIds: { has: userId } },
        data: { userIds: { set: [] } },
      });

      // Delete two factor confirmation
      await prisma.twoFactorConfirmation.deleteMany({
        where: { userId: userId },
      });

      // Delete any associated accounts
      await prisma.account.deleteMany({
        where: { userId: userId },
      });

      // Delete doctor profile if exists
      if (userRecord.doctor?.length > 0) {
        const doctorImages =
          userRecord.doctor[0].images || [];
        for (const image of doctorImages) {
          const publicId = image
            .split("/")
            .pop()
            ?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(
              `hello-doctor/${publicId}`
            );
          }
        }
        await prisma.doctor.deleteMany({
          where: { userId: userId },
        });
      }

      // Delete patient profile if exists
      if (userRecord.patient?.length > 0) {
        await prisma.patient.deleteMany({
          where: { userId: userId },
        });
      }

      // Delete user's profile image from Cloudinary
      if (userRecord.image) {
        const publicId = userRecord.image
          .split("/")
          .pop()
          ?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(
            `hello-doctor/${publicId}`
          );
        }
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: userId },
      });
    });

    revalidatePath("/");
    return NextResponse.json({
      success: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
