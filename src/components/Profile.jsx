import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosIns from "../utils/axios";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { AtSign, Mail, Pen, Phone, Text, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import getFileURL from "../utils/getFileURL";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email"),
  bio: z.string().max(160, "Bio must be 160 characters or less"),
  profile: z.any(),
});

export default function Profile() {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profilePreview, setProfilePreview] = useState(() => {
    return user?.profile ? getFileURL(user.profile) : "";
  });
  const fileInputRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  });
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setValue("profile", e.target.files); // 👈 This line is the magic
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "profile" && data.profile instanceof FileList) {
          formData.append("profile", data.profile[0]);
        } else {
          formData.append(key, data[key]);
        }
      }

      const { data: resData } = await axiosIns.put(
        `/users/${user._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(resData);
      localStorage.setItem("user", JSON.stringify(resData));
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <Card className="shadow-none max-w-2xl mx-auto mt-10">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <Button onPress={() => setEditMode((prev) => !prev)} variant="outline">
          {editMode ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>

      <CardBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="relative max-w-fit">
            <div className="w-24 h-24 rounded-full overflow-hidden border">
              <img
                src={profilePreview || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {editMode && (
              <Button
                isIconOnly
                size="sm"
                radius="full"
                startContent={<Pen />}
                onPress={() => fileInputRef.current.click()}
                className="absolute top-0 left-0 w-24 h-24 opacity-50"
              />
            )}
            <input
              type="file"
              accept="image/*"
              {...register("profile")}
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>

          <Input
            startContent={<AtSign />}
            {...register("username")}
            label="Username"
            disabled={!editMode}
            className="w-full"
            errorMessage={errors?.username?.message}
            isInvalid={!!errors?.username}
          />

          <div className="flex gap-4">
            <Input
              startContent={<User />}
              {...register("firstName")}
              label="First Name"
              disabled={!editMode}
              className="w-full"
              errorMessage={errors?.firstName?.message}
              isInvalid={!!errors?.firstName}
            />
            <Input
              startContent={<User />}
              {...register("lastName")}
              label="Last Name"
              disabled={!editMode}
              className="w-full"
              errorMessage={errors?.lastName?.message}
              isInvalid={!!errors?.lastName}
            />
          </div>

          <Input
            startContent={<Phone />}
            {...register("phone")}
            label="Phone"
            disabled={!editMode}
            className="w-full"
            errorMessage={errors?.phone?.message}
            isInvalid={!!errors?.phone}
          />

          <Input
            startContent={<Mail />}
            {...register("email")}
            label="Email"
            disabled
            className="w-full"
            errorMessage={errors?.email?.message}
            isInvalid={!!errors?.email}
          />

          <Textarea
            startContent={<Text />}
            {...register("bio")}
            label="Bio"
            disabled={!editMode}
            className="w-full"
            rows={3}
            errorMessage={errors?.bio?.message}
            isInvalid={!!errors?.bio}
          />

          {editMode && (
            <Button type="submit" color="success" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
