import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Key, Lock, Mail, User } from "lucide-react";
import React from "react";

export default function SignUp() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="mx-auto p-6 w-full max-w-md">
        <CardHeader className="text-center">
          <p className="font-medium text-2xl">Create Account</p>
        </CardHeader>
        <CardHeader className="text-gray-600 text-center">
          Join Gapistan and start chatting today.
        </CardHeader>

        <CardBody>
          <form className="space-y-5">
            {/* Username */}
            <div>
              <Input
                fullWidth
                startContent={<User size={16}/>}
                label="Username"
                type="text"
                id="username"
                name="username"
                required
                />
            </div>

            {/* Email */}
            <div>
              <Input
                fullWidth
                startContent={<Mail size={16}/>}
                label="Email"
                type="email"
                id="email"
                name="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Input
                fullWidth
                startContent={<Lock size={16}/>}
                label="Password"
                type="password"
                id="password"
                name="password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                fullWidth
                startContent={<Lock size={16}/>}
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" required className="text-lime-600 dark:text-lime-400" />
                <span className="text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-lime-600 dark:text-lime-400 hover:underline">
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
              Register
            </Button>
          </form>
        </CardBody>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Already have an account?
          <a href="#" className="text-lime-500 hover:underline">
            {" "}
            Login
          </a>
        </p>
      </Card>
    </div>
  );
}
