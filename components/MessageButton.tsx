"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createConversation } from "@/actions/messaging/conversation";
import { useCurrentRole } from "@/hooks/useCurrentRole";

interface MessageButtonProps {
  doctorId: string | undefined;
}

const MessageButton = ({
  doctorId,
}: MessageButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const userRole = useCurrentRole();

  const role = userRole?.toLowerCase();

  if (!doctorId) {
    return null;
  }

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const { conversationId } = await createConversation(
        doctorId
      );
      router.push(`/${role}/messages/${conversationId}`);
    } catch (error) {
      console.error("MESSAGE_BUTTON_ERROR", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex-1 bg-black text-white h-14 rounded-md font-semibold text-lg hover:bg-green-600 transition-colors duration-300"
      variant="default"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Message"}
    </Button>
  );
};

export default MessageButton;
