import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Lock, Mail, User } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import PassInput from "../components/PassInput";
import { useAuth } from "../contexts/AuthContext";

const schema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "Passwords do not match",
      });
    }
  });

export default function SignUp() {
  const { signUp, isLoggedIn } = useAuth();

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  // const checkUsername = async (username) => {
  //   if (username.length < 3) {
  //     return "Username must be at least 3 characters long";
  //   }
  //   try {
  //     const { data } = await axiosIns.post("/auth/check-username", {
  //       username,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     if (error.response.status === 409) {
  //       formState.errors.username.message = error.response.data.message;
  //       return "Username already exists";
  //     }
  //   }
  // };

  const onSubmit = handleSubmit(async (formData) => {
    await signUp(formData);
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat", { replace: true });
    }
  }, []);

  if (isLoggedIn) return null; 

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="mx-auto p-6 border w-full max-w-md">
        <CardHeader className="text-center">
          <p className="font-medium text-2xl">Create Account</p>
        </CardHeader>
        <CardHeader className="text-gray-600 text-center">
          Join Gapistan and start chatting today.
        </CardHeader>

        <CardBody>
          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Username */}
            <div>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    fullWidth
                    variant="faded"
                    startContent={<User size={16} />}
                    label="Username"
                    type="text"
                    id="username"
                    required
                    errorMessage={formState.errors.username?.message}
                    isInvalid={!!formState.errors.username}
                  />
                )}
              />
            </div>

            {/* Email */}
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    fullWidth
                    variant="faded"
                    startContent={<Mail size={16} />}
                    label="Email"
                    type="email"
                    id="email"
                    required
                    errorMessage={formState.errors.email?.message}
                    isInvalid={!!formState.errors.email}
                  />
                )}
              />
            </div>

            {/* Password */}
            <div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PassInput
                    {...field}
                    fullWidth
                    variant="faded"
                    startContent={<Lock size={16} />}
                    label="Password"
                    type="password"
                    id="password"
                    required
                    errorMessage={formState.errors.password?.message}
                    isInvalid={!!formState.errors.password}
                  />
                )}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PassInput
                    {...field}
                    fullWidth
                    variant="faded"
                    startContent={<Lock size={16} />}
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    required
                    errorMessage={formState.errors.confirmPassword?.message}
                    isInvalid={!!formState.errors.confirmPassword}
                  />
                )}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  required
                  className="text-lime-600 dark:text-lime-400"
                />
                <span className="text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    terms and conditions
                  </a>
                </span>
              </label>
            </div>

            {/* Register Button */}
            <Button
              fullWidth
              type="submit"
              className="bg-lime-500 hover:bg-300 dark:hover:bg-lime-400 py-2 rounded-xl w-full font-semibold text-white dark:text-black transition duration-300"
            >
              Sign up
            </Button>
          </form>
        </CardBody>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Already have an account?
          <Link to="/signin" className="text-lime-500 hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
