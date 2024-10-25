"user server";

import { db } from "@/lib/db";

export async function getDoctors() {
  try {
    const doctors = await db.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user?.name ?? "Unknown",
      email: doctor.user?.email ?? "No email provided",
      specialization: doctor.specialization,
      images: doctor.images,
      aboutMe: doctor.aboutMe,
      specialties: doctor.specialties,
      certifications: doctor.certifications,
      professionalExperience: doctor.professionalExperience,
      languages: doctor.languages,
    }));
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
} // import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// // Handler for GET /api/doctors/[id]
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;

//     const doctor = await db.doctor.findUnique({
//       where: { id },
//       include: {
//         user: {
//           select: {
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!doctor) {
//       return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
//     }

//     return NextResponse.json(doctor);
//   } catch (error) {
//     console.error("Error fetching doctor details:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // Handler for DELETE /api/doctors/[id]
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;

//     const deletedDoctor = await db.doctor.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: "Doctor deleted successfully", deletedDoctor });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
//   }
// }
// SEND SMS NOTIFICATION
// This part would depend on which SMS service you're using with Node.js. For example, Twilio:
// import twilio from 'twilio';

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// export const sendSMSNotification = async (userId: string, content: string) => {
//   try {
//     const message = await client.messages.create({
//       body: content,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: userId, // Ensure userId is the phone number in the correct format
//     });

//     return parseStringify(message);
//   } catch (error) {
//     console.error("An error occurred while sending sms:", error);
//   }
// };

// SEND SMS NOTIFICATION
// This part would depend on which SMS service you're using with Node.js. For example, Twilio:
// import twilio from 'twilio';

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// export const sendSMSNotification = async (userId: string, content: string) => {
//   try {
//     const message = await client.messages.create({
//       body: content,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: userId, // Ensure userId is the phone number in the correct format
//     });

//     return parseStringify(message);
//   } catch (error) {
//     console.error("An error occurred while sending sms:", error);
//   }
// };
