import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const body = await request.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;

    const data = {
      user_id: user.id,
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      data
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.log("[PUSHER_AUTH_ERROR]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
