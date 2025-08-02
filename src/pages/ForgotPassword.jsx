import { Controller, useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { z } from "zod";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import axiosIns from "../utils/axios";
import { Card, CardBody } from "@heroui/card";

const loginSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
});

function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function getEmailAlias() {
    const mailArr = getValues("email").split("@");
    const substr = mailArr[0].slice(2);
    mailArr[0] = mailArr[0].replace(substr, "***");
    setEmail(mailArr.join("@"));
  }

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
      const { data } = await axiosIns.post("/auth/forgot-password", values);
      console.log(data)
      setIsSent(true);
      getEmailAlias();
      addToast({
        title: "Password Reset Link Sent",
        description: `A password reset link has been sent to ${email}`,
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error sending password reset link",
        description: error.response?.data?.message,
        color: "danger",
      });
    }
  }

  return (
    <div className="h-screen flex items-center">
      <Card className="m-auto w-96 p-4 text-center">
        {isSent ? (
          <>
            <h1 className="text-3xl font-semibold">
              Password Reset Link Sent!
            </h1>
            <p className="mt-10 text-sm">
              A password reset link has been sent to &nbsp;
              {email}
            </p>
          </>
        ) : (
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-3xl font-semibold my-6 text-center">
                Forgot Password?
              </h1>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email"
                    className="mt-6"
                    variant="faded"
                    isInvalid={errors.email ? true : false}
                    errorMessage={errors.email?.message}
                    {...field}
                  />
                )}
              />
              <Button
                className="w-full mt-6 bg-lime-400 text-white"
                size="lg"
                type="submit"
              >
                Get a Reset Link
              </Button>
            </form>
          </CardBody>
        )}
        <p className="text-center mt-8">
          <span className="text-gray-400">Back to </span>
          <Link to="/signin" className="font-semibold underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default ForgotPassword;
