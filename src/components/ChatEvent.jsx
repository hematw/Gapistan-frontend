import {
  ArrowRight,
  Phone,
  PhoneMissed,
  UserPlus,
  UserRoundX,
} from "lucide-react";
import React from "react";

function ChatEvent({ event }) {
  const getIcon = (type) => {
    switch (type) {
      case "user_joined":
      case "user_added":
        return <UserPlus size={16} />;
      case "user_removed":
      case "user_left":
        return <UserRoundX size={16} />;
      case "call_started":
        return <Phone size={16} />;
      case "call_missed":
        return <PhoneMissed size={16} />;
      case "notification":
        return <ArrowRight size={16} />;
      default:
        return <ArrowRight size={16} />;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-300 dark:bg-dark-2 shadow-sm !my-4 p-2 rounded-md text-black dark:text-gray-100 text-xs w-fit max-w-[80%] mx-auto">
      <span>{getIcon(event.type)}</span>
      <span className="text-center">{event.content}</span>
    </div>
  );
}

export default ChatEvent;
