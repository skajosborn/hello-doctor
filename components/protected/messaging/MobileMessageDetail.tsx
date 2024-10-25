"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/actions/messaging/messaging";
import { Message, User } from "@prisma/client";
import Avatar from "@/components/Avatar";
import { markConversationAsRead } from "@/actions/messaging/conversation";
import { ExtendedUser } from "@/next-auth";

interface ExtendedMessage extends Message {
  sender: User;
  seen: User[];
}

interface MobileMessageDetailProps {
  userType: string;
  conversationId: string;
  currentUser: ExtendedUser;
  otherUser: User;
  initialMessages: ExtendedMessage[];
}

const MobileMessageDetail = ({
  userType,
  conversationId,
  currentUser,
  otherUser,
  initialMessages,
}: MobileMessageDetailProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] =
    useState<ExtendedMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable body scrolling when component mounts
    document.body.style.overflow = "hidden";

    // Re-enable body scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        if (currentUser.id) {
          await markConversationAsRead(
            conversationId,
            currentUser.id
          );
        }
      } catch (error) {
        console.error(
          "Error marking conversation as read:",
          error
        );
      }
    };

    markAsRead();
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: ExtendedMessage) => {
      setMessages((current) => {
        if (
          currentUser.id &&
          message.senderId !== currentUser.id
        ) {
          markConversationAsRead(
            conversationId,
            currentUser.id
          );
        }
        return [...current, message];
      });
    };

    pusherClient.bind("messages:new", messageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
    };
  }, [conversationId, currentUser.id]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "" || isLoading) return;

    try {
      setIsLoading(true);
      await sendMessage({
        message: message.trim(),
        conversationId,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="pl-3 p-2 border-b border-border bg-bgLight z-10 flex items-center">
        <Link href={`/${userType}/messages`}>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <Avatar
          user={otherUser}
          width={50}
          height={50}
          className="mr-3"
        />
        <h2 className="text-lg font-semibold">
          {otherUser?.name}
        </h2>
      </div>

      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 pb-20 flex flex-col-reverse"
      >
        {messages
          .slice()
          .reverse()
          .map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.senderId === currentUser.id
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.senderId === currentUser.id
                    ? "bg-bgBlack text-primary-foreground"
                    : "bg-primaryColor/70"
                }`}
              >
                {msg.body && <p>{msg.body}</p>}
                <span className="text-xs opacity-50">
                  {new Date(
                    msg.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
      </div>

      <div className="p-4 border-t border-border bg-bgLight sticky bottom-0 left-0 right-0 z-10">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 mr-2"
            disabled={isLoading}
          />
          <Button
            className="!bg-primaryColor"
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMessageDetail;
