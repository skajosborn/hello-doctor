import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { Input } from "@/components/ui/input";
import { Conversation } from "./MobileMessageList";
import { User } from "next-auth";

const SearchInput = ({
  conversations,
  setFilteredConversationsSearch,
  currentUserId,
}: {
  conversations: Conversation[];
  setFilteredConversationsSearch: React.Dispatch<
    React.SetStateAction<Conversation[]>
  >;
  currentUserId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getOtherUser = useCallback(
    (conversation: Conversation): User | undefined => {
      return conversation.users.find(
        (user) => user.id !== currentUserId
      );
    },
    [currentUserId]
  );

  useEffect(() => {
    const filteredConversations =
      searchQuery === ""
        ? conversations
        : conversations.filter((conversation) => {
            const otherUser = getOtherUser(conversation);
            return otherUser?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());
          });

    setFilteredConversationsSearch(filteredConversations);
  }, [
    searchQuery,
    conversations,
    currentUserId,
    setFilteredConversationsSearch,
    getOtherUser,
  ]);

  return (
    <Input
      type="text"
      placeholder="Search Conversation"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="mb-4 bg-inputBg border-inputBorder placeholder-placeholder text-textDark"
    />
  );
};

export default SearchInput;
