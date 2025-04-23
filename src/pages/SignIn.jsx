import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import PassInput from "../components/PassInput";
import { useAuth } from "../contexts/AuthContext";

const schema = z.object({
  email: z.string(),
  password: z.string().min(6, "Minimum password length is 6 characters"),
});

export default function SignIn() {
  const { signIn, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    await signIn(formData);
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat", { replace: true });
    }
  }, []);

  if (isLoggedIn) return null;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="shadow-none mx-auto p-6 border w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="font-medium text-2xl">Login to Gapistan</h2>
        </CardHeader>
        <CardHeader className="text-gray-600 text-center">
          Welcome back! Please login to your account.
        </CardHeader>

        <CardBody>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={formState.errors.email?.message}
                    isInvalid={!!formState.errors.email}
                    fullWidth
                    variant="faded"
                    startContent={<Mail size={16} />}
                    label="Email or Username"
                    type="text"
                    name="email"
                    required
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PassInput
                    {...field}
                    errorMessage={formState.errors.password?.message}
                    isInvalid={!!formState.errors.password}
                    fullWidth
                    variant="faded"
                    startContent={<Lock size={16} />}
                    label="Password"
                    type="password"
                    name="password"
                    required
                  />
                )}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="text-lime-600 dark:text-lime-400"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-lime-600 dark:text-lime-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              fullWidth
              type="submit"
              className="bg-lime-400 hover:bg-300 py-2 rounded-xl w-full font-semibold text-white dark:text-black transition duration-300"
            >
              Sign In
            </Button>
          </form>
        </CardBody>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Don’t have an account?
          <Link to="/signup" className="text-lime-400 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
