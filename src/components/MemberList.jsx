import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "@heroui/user";
import { useQuery } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import getFileURL from "../utils/setFileURL";
import { useAuth } from "../contexts/AuthContext";

function MemberList({ members, selectedChat }) {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chats", selectedChat?._id, "members"],
    queryFn: async () => {
      const { data } = await axiosIns.get(
        `/chats/${selectedChat?._id}/members`
      );
      return data;
    },
    enabled: !!selectedChat?._id,
  });

  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
      <CardHeader>Members</CardHeader>
      <CardBody>
        {data?.members.map((member, index) => (
          <User
            key={index}
            className="justify-stretch py-1"
            avatarProps={{
              src: getFileURL(member.profile),
            }}
            name={
              user._id === member._id
                ? "You"
                : member.firstName
                ? member.firstName + " " + member.lastName
                : member.username
            }
            description={data.groupAdmin.includes(member._id) && "Admin"}
            classNames={{
              base: "hover:bg-gray-100 dark:hover:bg-dark-2 transition-all duration-200",
            }}
          />
        ))}
      </CardBody>
    </Card>
  );
}

export default MemberList;
