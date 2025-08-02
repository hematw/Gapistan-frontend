import { Controller, useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PassInput from "../components/PassInput";

import { z } from "zod";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosIns from "../utils/axios";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // set the error path to confirmPassword
    message: "Confirm password does not match",
  });

function ResetPassword() {
  const [URLSearchParams] = useSearchParams();
  const resetToken = URLSearchParams.get("token");
  const user = URLSearchParams.get("user");
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Submit handler function
  async function onSubmit(values) {
    try {
      const { data } = await axiosIns.post(
        `/auth/reset-password?token=${resetToken}&user=${user}`,
        values
      );
      reset();
      addToast({
        title: "Success",
        description: data.message,
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: error.response?.data?.message,
        color: "danger",
      });
    }
  }

  return (
    <div className="h-screen flex items-center">
      <Card className="m-auto w-96 p-4">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center my-4">
            Create a new Password
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PassInput
                  label="Password"
                  variant="faded"
                  isInvalid={errors.password ? true : false}
                  errorMessage={errors.password?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PassInput
                  label="Confirm Password"
                  variant="faded"
                  className="mt-6"
                  isInvalid={errors.confirmPassword ? true : false}
                  errorMessage={errors.confirmPassword?.message}
                  {...field}
                />
              )}
            />
            <Button
              className="w-full mt-6 text-white bg-lime-400"
              type="submit"
            >
              <span>Save and continue</span>
              <span>
                <ArrowRight width={18} />
              </span>
            </Button>
          </form>
          <p className="text-center my-2">Or try sign in again <Link to="/signin" className="text-lime-400 drop-shadow font-semibold">Sign in</Link></p>
        </CardBody>
      </Card>
    </div>
  );
}

export default ResetPassword;
