import React, { lazy, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosIns from "../utils/axios";

const ChatActions = lazy(() => import("./ChatActions"));
const MemberList = lazy(() => import("./MemberList"));
const FileSection = lazy(() => import("./FileSection"));

function RightSidebar({ files, selectedChat,handleCall }) {
  console.log(files);
  const { data, isLoading, error } = useQuery({
    queryKey: ["chats", selectedChat?._id, "files"],
    queryFn: async () => {
      const { data } = await axiosIns.get(`/chats/${selectedChat?._id}/files`);
      return data;
    },
    enabled: !!selectedChat?._id,
  });

  if (error) {
    console.log(error);
  }

  return (
    <div className="space-y-4 pr-2 pb-4 min-w-64 overflow-auto hidden lg:block max-h-full">
      <ChatActions selectedChat={selectedChat} handleCall={handleCall} />

      {selectedChat.isGroup && <MemberList selectedChat={selectedChat} />}

      {isLoading ? "Loading files" : <FileSection data={data} />}
    </div>
  );
}

export default memo(RightSidebar);
