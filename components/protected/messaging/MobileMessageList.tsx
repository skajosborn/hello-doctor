"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  deleteConversation,
  getConversations,
} from "@/actions/messaging/conversation";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import Avatar from "@/components/Avatar";
import SearchInput from "./SearchInput";

interface Message {
  id: string;
  body: string | null;
  senderId: string;
  createdAt: Date;
  seenIds: string[];
  sender: {
    name: string;
  };
}

export interface Conversation {
  id: string;
  users: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
  messages: Message[];
  lastMessageAt: Date;
}

const MobileMessageList = ({
  userType,
  currentUserId,
}: {
  userType: string;
  currentUserId: string;
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);
  const [
    filteredConversationsSearch,
    setFilteredConversationsSearch,
  ] = useState<Conversation[]>([]);
  const [swipedMessageId, setSwipedMessageId] = useState<
    string | null
  >(null);
  const startXRef = useRef(0);

  useEffect(() => {
    const initConversations = async () => {
      const result = await getConversations();
      setConversations(result);
      setFilteredConversationsSearch(result);
    };

    initConversations();

    // Subscribe to user-specific channel
    const channel = pusherClient.subscribe(currentUserId);

    channel.bind(
      "conversation:new",
      (conversation: Conversation) => {
        setConversations((current) => {
          const exists = current.some(
            (conv) => conv.id === conversation.id
          );
          if (exists) return current;
          return [conversation, ...current];
        });
      }
    );

    channel.bind(
      "conversation:update",
      (updatedConversation: Conversation) => {
        setConversations((current) => {
          return current
            .map((conversation) => {
              if (
                conversation.id === updatedConversation.id
              ) {
                return {
                  ...conversation,
                  messages: updatedConversation.messages,
                  lastMessageAt:
                    updatedConversation.lastMessageAt,
                };
              }
              return conversation;
            })
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime()
            );
        });
      }
    );

    channel.bind(
      "conversation:remove",
      (removedConversation: Conversation) => {
        setConversations((current) =>
          current.filter(
            (conv) => conv.id !== removedConversation.id
          )
        );
      }
    );

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(currentUserId);
    };
  }, [currentUserId]);

  // Update filtered conversations when main conversations change
  useEffect(() => {
    setFilteredConversationsSearch(conversations);
  }, [conversations]);

  const isConversationRead = (
    conversation: Conversation
  ) => {
    // If there are no messages the conversation is considered "unread"
    if (
      !conversation.messages ||
      conversation.messages.length === 0
    ) {
      return false;
    }

    // Check if messages have been seen by the current user
    return conversation.messages.every((message) =>
      message.seenIds.includes(currentUserId)
    );
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.users.find(
      (user) => user.id !== currentUserId
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === now.toDateString()) {
      // Same day, show time in 12-hour format with AM/PM
      return format(messageDate, "h:mm a");
    } else if (
      messageDate.getFullYear() === now.getFullYear()
    ) {
      // Same year, show day and month
      return format(messageDate, "dd MMM");
    }
    // Different year, show full date
    return format(messageDate, "dd/MM/yyyy");
  };

  const handleDelete = async (id: string) => {
    try {
      // Optimistically update local state
      setConversations((current) =>
        current.filter((conv) => conv.id !== id)
      );

      // Delete on server
      await deleteConversation(id);

      // Reset swiped message state
      setSwipedMessageId(null);

      // Force router refresh
      router.refresh();
    } catch (error) {
      console.error("Error deleting conversation:", error);

      // Revert optimistic update on error
      const result = await getConversations();
      setConversations(result);
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent,
    id: string
  ) => {
    if (swipedMessageId && swipedMessageId !== id) {
      const prevMessageElement = document.getElementById(
        `message-${swipedMessageId}`
      );
      if (prevMessageElement) {
        prevMessageElement.style.transform =
          "translateX(0)";
      }
    }
    startXRef.current = e.touches[0].clientX;
    setSwipedMessageId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipedMessageId) return;

    const currentX = e.touches[0].clientX;
    const diff = startXRef.current - currentX;
    const messageElement = document.getElementById(
      `message-${swipedMessageId}`
    );

    if (messageElement) {
      if (diff > 0) {
        messageElement.style.transform = `translateX(-${Math.min(
          diff,
          80
        )}px)`;
      } else {
        messageElement.style.transform = `translateX(${Math.min(
          -diff,
          0
        )}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!swipedMessageId) return;

    const messageElement = document.getElementById(
      `message-${swipedMessageId}`
    );
    if (messageElement) {
      const computedStyle =
        window.getComputedStyle(messageElement);
      const transform = new WebKitCSSMatrix(
        computedStyle.transform
      );

      if (transform.m41 < -40) {
        messageElement.style.transform =
          "translateX(-80px)";
      } else {
        messageElement.style.transform = "translateX(0)";
        setSwipedMessageId(null);
      }
    }
  };

  // Filter conversations based on active tab from the search-filtered results
  const filteredConversations =
    filteredConversationsSearch.filter((conversation) => {
      const isRead = isConversationRead(conversation);

      switch (activeTab) {
        case "read":
          return isRead;
        case "unread":
          return !isRead;
        default:
          return true;
      }
    });

  return (
    <div className="flex flex-col h-screen bg-bgLight">
      <div className="p-4 border-b border-border">
        <SearchInput
          conversations={conversations}
          setFilteredConversationsSearch={
            setFilteredConversationsSearch
          }
          currentUserId={currentUserId}
        />
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 bg-inputBg border-inputBorder placeholder-placeholder">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1">
        {filteredConversations?.map((conversation) => {
          const otherUser = getOtherUser(conversation);
          const lastMessage =
            conversation.messages?.length > 0
              ? conversation.messages[0]
              : null;
          const isRead = isConversationRead(conversation);

          return (
            <div
              key={conversation.id}
              id={`message-${conversation.id}`}
              className="relative"
              onTouchStart={(e) =>
                handleTouchStart(e, conversation.id)
              }
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transition: "transform 0.2s ease-out",
              }}
            >
              <Link
                href={`/${userType}/messages/${conversation.id}`}
              >
                <div
                  className={`flex items-center p-4 border-b border-border cursor-pointer ${
                    !isRead ? "bg-inputBg" : "bg-bgLight"
                  }`}
                >
                  {otherUser && (
                    <Avatar
                      user={otherUser}
                      width={55}
                      height={55}
                      className="mr-3"
                    />
                  )}

                  <div className="flex-1 flex flex-col">
                    <h3
                      className={`font-semibold ${
                        !isRead ? "font-bold" : ""
                      }`}
                    >
                      {otherUser?.name}
                    </h3>
                    {lastMessage && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {lastMessage.senderId ===
                        currentUserId
                          ? "You: "
                          : ""}
                        {lastMessage.body}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground self-center">
                    {formatTime(conversation.lastMessageAt)}
                  </span>
                </div>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                className="absolute top-0 right-0 bottom-0 w-20 rounded-none h-full"
                onClick={() =>
                  handleDelete(conversation.id)
                }
                style={{ transform: "translateX(100%)" }}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default MobileMessageList;
