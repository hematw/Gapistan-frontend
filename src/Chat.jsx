import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Navbar, NavbarBrand } from "@heroui/navbar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import React, { useEffect, useState } from "react";
import { Badge } from "@heroui/badge";
import Conversation from "./components/Conversation";
import Sidebar from "./components/Sidebar";
import { User } from "@heroui/user";
import { PhoneCall, Pin, Send, Users, Video } from "lucide-react";
import { useSocket } from "./contexts/SocketContext";
import { Accordion, AccordionItem } from "@heroui/accordion";

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
    events: [],
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
      {
        type: "video-call",
        sender: "Richard Wilson",
        time: "6:35 PM",
        text: "started a video call",
        isYou: false,
      },
    ],
  },
];

function ICGChat() {
  const { socket } = useSocket();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState();

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

  return (
    <>
      <div className="w-full h-screen overflow-auto p-4 flex gap-4">
        <div className="w-96 flex">
          <Sidebar />
          <div className="space-y-3 max-h-full w-80 overflow-auto px-4 ">
            {conversations.map((conv, index) => (
              <Conversation
                key={index}
                name={conv.name}
                isYou={conv.isYou}
                unread={conv.unread}
                lastMessage={conv.lastMessage}
              />
            ))}
          </div>
        </div>

        <div className="min-h-full flex flex-col bg-dark rounded-2xl flex-1">
          <div className="flex-1 p-4 overflow-y-auto h-full">
            {/* Messages would be rendered here */}
            <div className="space-y-4">
              {/* Example message */}
              {messages[1].chats.map((chat, index) => {
                return (
                  <div
                    className={`flex items-start ${
                      chat.isYou ? "bg-limegreen/50" : ""
                    }`}
                    key={index}
                  >
                    <Avatar
                      name="Conner Garcia"
                      size="sm"
                      src="https://100k-faces.glitch.me/random-image"
                    />
                    <div className="ml-3 w-[70%]">
                      <div className="flex items-center">
                        <span className="font-medium">{chat.sender}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {chat.time}
                        </span>
                      </div>
                      <p className="mt-1">{chat.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t">
            <form action={sendMessage}>
              <div className="flex">
                <Input
                  placeholder="Write a message..."
                  variant="flat"
                  name="message"
                />
                <Button
                  className="ml-2 bg-limegreen"
                  startContent={<Send />}
                  isIconOnly
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="min-w-64 space-y-4">
          <Card className="bg-dark">
            <CardBody className="flex flex-row justify-between">
              <Button
                isIconOnly
                radius="full"
                startContent={<PhoneCall />}
                className="bg-limegreen"
              />
              <Button
                isIconOnly
                radius="full"
                startContent={<Video />}
                className="bg-dark-2 text-white"
              />
              <Button
                isIconOnly
                radius="full"
                startContent={<Pin />}
                className="bg-dark-2 text-white"
              />
              <Button
                isIconOnly
                radius="full"
                startContent={<Users />}
                className="bg-dark-2 text-white"
              />
            </CardBody>
          </Card>
          <Card className="bg-dark text-white">
            <CardHeader>
              <h3 className="font-bold">Members</h3>
            </CardHeader>
            <CardBody>
              {members.map((member, index) => (
                <User
                  key={index}
                  className="justify-stretch py-1"
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                  }}
                  name={member.name}
                  classNames={{
                    base: "hover:bg-dark-2 transition-all duration-200",
                  }}
                />
              ))}
            </CardBody>
          </Card>

          <Card className="bg-dark mt-4 text-white">
            <CardHeader>Files</CardHeader>
            <CardBody>
              <Accordion selectionMode="multiple" className="text-white">
                {files.map((file) =>{
                  switch file.type {
                    case "photos":
                      return <AccordionItem
                      key="1"
                      aria-label="Accordion 1"
                      title={file.count}
                    >
                      {"ABC"}
                    </AccordionItem>
                    break;
                    case "files":
                      return <AccordionItem
                      key="1"
                      aria-label="Accordion 1"
                      title={file.count}
                    >
                      {"ABC"}
                    </AccordionItem>
                    break;
                    case "shared links":
                      return <AccordionItem
                      key="1"
                      aria-label="Accordion 1"
                      title={file.count}
                    >
                      {"ABC"}
                    </AccordionItem>
                    break;
                  }
                  })}
              </Accordion>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ICGChat;
