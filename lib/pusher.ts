import PusherClient from "pusher-js";
import PusherServer from "pusher";

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
    cluster: process.env
      .NEXT_PUBLIC_PUSHER_CLUSTER as string,
  }
);

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});
