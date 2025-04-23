import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../contexts/SocketContext";
import { Chip } from "@heroui/chip";
import {
  Bell,
  Search,
  Send,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatListPanel from "../components/ChatListPanel";
import RightSidebar from "../components/RightSidebar";
import MessageBubble from "../components/MessageBubble";
import ChatEvent from "../components/ChatEvent";

const conversations = [
  {
    id: 1,
    name: "Jabien",
    lastMessage: "Let’s discuss this icon...",
    unread: false,
  },
  {
    id: 2,
    name: "Sarah Parker",
    lastMessage: "Ok, see you soon!",
    unread: false,
    isYou: true,
  },
  {
    id: 3,
    name: "Abubakar Campbell",
    lastMessage: "Do you think we can do it?",
    unread: false,
    isYou: true,
  },
  { id: 4, name: "Nathaniel Jordan", lastMessage: "I’m busy!", unread: true },
  {
    id: 5,
    name: "Conner Garcia",
    lastMessage: "Hey, maybe we can meet...",
    unread: false,
    isYou: true,
  },
  {
    id: 6,
    name: "Cynthia Mckay",
    lastMessage: "Maybe.",
    unread: false,
    isYou: true,
  },
  {
    id: 7,
    name: "Cora Richards",
    lastMessage: "Will you go play?",
    unread: true,
  },
  {
    id: 8,
    name: "Lawrence Patterson",
    lastMessage: "I have the guys what they think!",
    unread: true,
  },
  {
    id: 9,
    name: "Lisa Mcgowan",
    lastMessage: "We can try this strategy!...",
    unread: false,
    isYou: true,
  },
  {
    id: 10,
    name: "Alan Bonner",
    lastMessage: "He is a great time yesterday!",
    unread: true,
  },
  {
    id: 11,
    name: "Fletcher Morse",
    lastMessage: "I need to work, sorry!",
    unread: false,
    isYou: true,
  },
];

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

const messages = [
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
  {
    date: "10 Sep 2024",
    events: [{ type: "video-call", text: "started a video call" }],
    chats: [
      {
        sender: "Lawrence Patterson",
        time: "6:25 PM",
        text: "@wilson @jparker I have a new game plan",
        isYou: true,
      },
      {
        sender: "Jaden Parker",
        time: "6:30 PM",
        text: "Let’s discuss this tomorrow",
        isYou: false,
      },
    ],
  },
];

function Chat() {
  const { socket } = useSocket();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState();

  const navigate = useNavigate();

  const sendMessage = (formdata) => {
    console.log(socket);
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    console.log("Sending message", formdata.get("message"));
    socket.emit("message", formdata.get("message"));
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="flex gap-4 p-4 w-full h-screen overflow-auto">
        <div className="flex w-96">
          <Sidebar />
          <ChatListPanel chats={conversations} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl fond-semibold">Gapistan</h1>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search"
                variant="flat"
                className="w-64"
                radius="full"
                startContent={<Search size={16} />}
              />

              <Button startContent={<Settings />} isIconOnly radius="full" />
              <Button startContent={<Bell />} isIconOnly radius="full" />
              <Avatar
                name="Conner Garcia"
                src="https://100k-faces.glitch.me/random-image"
                className="ml-2 min-w-10"
              />
            </div>
          </div>
          <div className="flex gap-4 h-[85vh]">
            <div className="flex flex-col flex-1 bg-white dark:bg-dark shadow-lg rounded-2xl">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((day, index) => (
                    <div key={index} className="space-y-1">
                      <Chip className="flex m-auto my-2">{day.date}</Chip>

                      {day.events.map((event, i) => (
                       <ChatEvent event={event} key={i} />
                      ))}

                      {day.chats.map((chat, i) => (
                        <MessageBubble chat={chat} />
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
                      name="message"
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
