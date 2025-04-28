import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../contexts/SocketContext";
import { Chip } from "@heroui/chip";
import { Bell, Send, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatListPanel from "../components/ChatListPanel";
import RightSidebar from "../components/RightSidebar";
import MessageBubble from "../components/MessageBubble";
import ChatEvent from "../components/ChatEvent";
import { useQuery } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { addToast } from "@heroui/toast";
import ChatHeader from "../components/ChatHeader";
import ProfileDropdown from "../components/ProfileDropdown";


const members = [
  { id: 1, name: "Richard Wilson", status: "online" },
  { id: 2, name: "Aamn", status: "offline" },
  { id: 3, name: "You", status: "online" },
  { id: 4, name: "Jaden Parker", status: "online" },
  { id: 5, name: "Conner Garcia", status: "away" },
  { id: 6, name: "Lawrence Patterson", status: "offline" },
];

const files = [
  { type: "photos", count: 115 },
  { type: "files", count: 200 },
  { type: "shared links", count: 47 },
];

// const messages = [
//   {
//     date: "9 Sep 2024",
//     events: [{ type: "notification", text: "Richard Wilson added You" }],
//     chats: [
//       {
//         sender: "Conner Garcia",
//         time: "6:00 PM",
//         text: 'Hey guys! Don’t forget about our meeting next week! I’ll be waiting for you at the "Cozy Corner" café at 6:00 PM. Don’t be late!',
//         isYou: false,
//       },
//       {
//         sender: "Richard Wilson",
//         time: "6:05 PM",
//         text: "Absolutely. I’ll be there! Looking forward to catching up and discussing everything.",
//         isYou: false,
//       },
//     ],
//   },
//   {
//     date: "10 Sep 2024",
//     events: [{ type: "video-call", text: "started a video call" }],
//     chats: [
//       {
//         sender: "Lawrence Patterson",
//         time: "6:25 PM",
//         text: "@wilson @jparker I have a new game plan",
//         isYou: true,
//       },
//       {
//         sender: "Jaden Parker",
//         time: "6:30 PM",
//         text: "Let’s discuss this tomorrow",
//         isYou: false,
//       },
//     ],
//   },
// ];

function Chat() {
  const { socket } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([
    {
      date: "9 Sep 2024",
      events: [{ type: "notification", text: "Richard Wilson added You" }],
      chats: [
        {
          sender: "Conner Garcia",
          time: "6:00 PM",
          text: 'Hey guys! Don’t forget about our meeting next week! I’ll be waiting for you at the "Cozy Corner" café at 6:00 PM. Don’t be late!',
          isYou: false,
        },
        {
          sender: "Richard Wilson",
          time: "6:05 PM",
          text: "Absolutely. I’ll be there! Looking forward to catching up and discussing everything.",
          isYou: false,
        },
      ],
    },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsErr,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await axiosIns.get("/chats");
      return data;
    },
  });

  const sendMessage = (formdata) => {
    console.log(socket);
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    const text = formdata.get("text");
    if (!text) {
      console.log("Message is empty");
      return addToast({
        title: "Message is empty",
        description: "Cannot send empty messages",
        color: "danger",
      });
    }

    console.log("Sending message", text);
    socket.emit("message", { receiver: "asdf", text }, (ack) => {
      console.log(ack);
      setMessages((prev) => [...prev, ack.message]);
    });
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("user_online", {
      userId: "6806a7d0d6f88e410971ee38",
    });

    socket.on("receive_message", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  if (chatsLoading) {
    return <p className="text-2xl">Loading...</p>;
  }

  return (
    <>
      <div className="flex gap-4 p-4 w-full h-screen overflow-auto">
        <div className="flex w-96">
          <Sidebar />
          <ChatListPanel
            chats={chatsData?.chats}
            isLoading={chatsLoading}
            setSelectedUser={setSelectedUser}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl fond-semibold">Gapistan</h1>
            <div className="flex items-center gap-2">
              <Button startContent={<Settings />} isIconOnly radius="full" />
              <Button startContent={<Bell />} isIconOnly radius="full" />
              <ProfileDropdown user={user}/>
               
            </div>
          </div>
          <div className="flex gap-4 h-[85vh]">
            <div className="flex flex-col flex-1 bg-white dark:bg-dark shadow-lg rounded-2xl">
              <ChatHeader />
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((day, index) => (
                    <div key={index} className="space-y-1">
                      <Chip className="flex m-auto my-2">{day.date}</Chip>

                      {day.events.map((event, i) => (
                        <ChatEvent event={event} key={i} />
                      ))}

                      {day.chats.map((chat, i) => (
                        <MessageBubble chat={chat} key={i} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <form action={sendMessage}>
                  <div className="flex">
                    <Input
                      placeholder="Write a message..."
                      variant="bordered"
                      name="text"
                    />
                    <Button
                      className="bg-limegreen ml-2 text-black"
                      startContent={<Send />}
                      isIconOnly
                      type="submit"
                    />
                  </div>
                </form>
              </div>
            </div>

            <RightSidebar members={members} files={files} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
