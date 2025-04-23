import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "@heroui/user";

function MemberList({ members }) {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
      <CardHeader>Members</CardHeader>
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
              base: "hover:bg-gray-100 dark:hover:bg-dark-2 transition-all duration-200",
            }}
          />
        ))}
      </CardBody>
    </Card>
  );
}

export default MemberList;
