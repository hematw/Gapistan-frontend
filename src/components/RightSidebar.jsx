    import React from "react";
import FileSection from "./FileSection";
import MemberList from "./MemberList";
import ChatActions from "./ChatActions";

function RightSidebar({ members, files }) {
  return (
    <div className="space-y-4 pr-2 pb-4 min-w-64 overflow-auto hidden lg:block max-h-full">
      <ChatActions />

      <MemberList members={members} />

      <FileSection files={files} />
    </div>
  );
}

export default RightSidebar;
