import React, { useState } from "react";
import ChatItem from "./ChatItem";
import { MessageCircleMore, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce";
import axiosIns from "../utils/axios";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { User } from "@heroui/user";

function ChatListPanel({ chats, setSelectedChat, setSelectedUser }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchErr,
  } = useQuery({
    queryKey: ["chats", debouncedSearch],
    queryFn: async () => {
      const { data } = await axiosIns.get(
        `/chats/search?query=${debouncedSearch}`
      );
      return data;
    },
    enabled: !!debouncedSearch,
  });

  if (searchErr) {
    console.error("Error fetching search results:", searchErr);
  }
  if (searchLoading) {
    console.log("Loading search results...");
  }

  return (
    <div className="space-y-3  w-80 max-h-full min-h-full overflow-auto">
      <div className="relative flex flex-col h-full">
        <Input
          fullWidth
          placeholder="Search"
          variant="flat"
          radius="lg"
          startContent={<Search size={16} />}
          value={search}
          onChange={(e) => {
            console.log(e.target.value);
            setSearch(e.target.value);
          }}
        />
        {searchResults || searchLoading ? (
          <div
            className={`bg-white  mt-4 dark:bg-dark flex-1 min-h-0 overflow-auto flex flex-col gap-4 items-center shadow-lg rounded-2xl`}
          >
            <Listbox
              aria-label="search results"
              className="rounded-xl z-50 mt-4 "
            >
              {searchLoading ? (
                <ListboxItem
                  aria-label="result"
                  className="rounded-none"
                  classNames={{
                    title: "flex items-center justify-center p-4",
                  }}
                >
                  <Spinner size="lg" color="success" className="block" />
                </ListboxItem>
              ) : (
                <>
                  <ListboxSection showDivider title="Chats">
                    {searchResults.chats.length ? (
                      searchResults?.chats?.map((chat, index) => (
                        <ListboxItem
                          key={index}
                          aria-label="result"
                          className="flex items-center gap-2 p-2 cursor-pointer rounded-none"
                          onPress={() => {
                            setSelectedChat(chat);
                            setSelectedUser(null);
                          }}
                        >
                          <ChatItem
                            key={index}
                            chatName={chat.chatName}
                            isYou={chat.isYou}
                            unread={chat.unread}
                            lastMessage={chat.lastMessage}
                            profile={chat.profile}
                            onClick={() => setSelectedChat(chat)}
                          />
                          {/* <User
                          name={chat.chatName}
                          description={`@${chat?.username}`}
                          avatarProps={{
                            src: chat?.profile,
                            fallback: chat.chatName[0].toUpperCase(),
                            showFallback: true,
                            color: "success",
                          }}
                        /> */}
                        </ListboxItem>
                      ))
                    ) : (
                      <ListboxItem
                        aria-label="result"
                        className="rounded-none"
                        classNames={{
                          title: "flex items-center justify-center p-4 ",
                        }}
                      >
                        No results found
                      </ListboxItem>
                    )}
                  </ListboxSection>
                  <ListboxSection title="Other Results">
                    {searchResults.otherResults.length ? (
                      searchResults?.otherResults?.map((user, index) => (
                        <ListboxItem
                          key={index}
                          aria-label="result"
                          className="flex items-center gap-2 p-2 cursor-pointer rounded-none"
                          onPress={() => {
                            const newChat = {
                              chatName: user.firstName
                                ? `${user.firstName} ${user.lastName}`
                                : user.username,
                              status: user.status,
                              profileImage: user.profileImage,
                              username: user.username,
                            };
                            setSelectedUser(user);
                            setSelectedChat(newChat);
                          }}
                        >
                          <User
                            name={user.chatName}
                            description={`@${user?.username}`}
                            avatarProps={{
                              src: user?.profile,
                              fallback: user.chatName[0].toUpperCase(),
                              showFallback: true,
                              color: "success",
                            }}
                          />
                        </ListboxItem>
                      ))
                    ) : (
                      <ListboxItem
                        aria-label="result"
                        className="rounded-none"
                        classNames={{
                          title: "flex items-center justify-center p-4",
                        }}
                      >
                        No results found
                      </ListboxItem>
                    )}
                  </ListboxSection>
                </>
              )}
            </Listbox>
          </div>
        ) : chats.length ? (
          <div className="w-full flex flex-col gap-4 mt-4">
            {chats.map((chat, index) => (
              <ChatItem
                key={index}
                chatName={chat.chatName}
                isYou={chat.isYou}
                unread={chat.unread}
                lastMessage={chat.lastMessage}
                onClick={() => setSelectedChat(chat)}
                isOnline={chat.isOnline}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center py-6 px-2 h-full">
            <div>
              <MessageCircleMore size={48} />
            </div>
            <div className="px-4 text-center ">
              <h3 className="text-xl font-semibold  py-2">No Chats Yet...</h3>
              <p className="text-sm text-default-400">
                The universe is waiting for you to say something! 🚀
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatListPanel;
