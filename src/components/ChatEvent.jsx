import { ArrowRight, Phone, User2 } from "lucide-react";
import React from "react";

function ChatEvent({ event }) {
  return (
    <div className="flex items-center gap-1 bg-gray-300 dark:bg-dark-2 shadow-sm !my-2 p-2 rounded-md text-black dark:text-gray-100 text-xs">
      <span>
        {event.type === "notification" ? (
          <ArrowRight size={16} />
        ) : event.type === "video-call" ? (
          <Phone size={16} />
        ) : (
          <User2 />
        )}
      </span>
      <span></span>
      {event.text}
    </div>
  );
}

export default ChatEvent;
