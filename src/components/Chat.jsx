import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Navbar, NavbarBrand } from "@heroui/navbar";
import {Card, CardBody, CardHeader} from "@heroui/card";
import React from "react";
import { Badge } from "@heroui/badge";

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
        isYou: false,
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

  return (
    <div className="chat-app">
      {/* Navbar */}
      <Navbar>
        <NavbarBrand>
          <span className="font-bold text-xl">ICG Chat</span>
        </NavbarBrand>
      </Navbar>

      <div className="flex h-screen">
        {/* Left sidebar - Conversations */}
        <div className="w-72 border-r">
          <Listbox>
            {conversations.map((conv) => (
              <ListboxItem key={conv.id}>
                <div className="flex items-center p-2 hover:bg-gray-100">
                  <Avatar name={conv.name} size="sm" />
                  <div className="ml-3">
                    <p className="font-medium">{conv.name}</p>
                    <p className="text-sm text-gray-500">
                      {conv.isYou ? "You: " : ""}
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <Badge color="primary" size="xs" className="ml-auto" />
                  )}
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Messages would be rendered here */}
            <div className="space-y-4">
              {/* Example message */}
              <div className="flex items-start">
                <Avatar name="Conner Garcia" size="sm" />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="font-medium">Conner Garcia</span>
                    <span className="text-xs text-gray-500 ml-2">6:00 PM</span>
                  </div>
                  <p className="mt-1">
                    Hey guys! Don't forget about our meeting next week!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message input */}
          <div className="p-4 border-t">
            <div className="flex">
              <Input placeholder="Write a message..." className="flex-1" />
              <Button color="danger" className="ml-2">
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Right sidebar - Members */}
        <div className="w-64 border-l p-4">
          <Card>
            <CardHeader>
              <h3 className="font-bold">Members</h3>
            </CardHeader>
            <CardBody>
              {members.map((member) => (
                <div key={member.id} className="flex items-center py-2">
                  {/* <User
                    name={member.name}
                    description={member.status}
                    avatarProps={{ size: "sm" }}
                  /> */}{member.name}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ICGChat;
