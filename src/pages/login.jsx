import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import React from "react";

function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="mx-auto p-6 w-full max-w-md">
        <CardHeader className="text-center">
          <p className="font-medium text-2xl">Login to Gapistan</p>
        </CardHeader>
        <CardHeader className="text-gray-600 text-center">
          Welcome back! Please login to your account.
        </CardHeader>

        <CardBody>
          <form className="space-y-5">
            <div>
              <Input
                fullWidth
                label="Email or Username"
                type="text"
                id="email"
                name="email"
                required
              />
            </div>

            <div>
              <Input
                fullWidth
                label="Password"
                type="password"
                id="password"
                name="password"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="text-lime-600 dark:text-lime-400" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-lime-600 dark:text-lime-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              fullWidth
              type="submit"
              className="bg-lime-400 hover:bg-300 py-2 rounded-xl w-full font-semibold text-white dark:text-black transition duration-300"
            >
              Login
            </Button>
          </form>
        </CardBody>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Don’t have an account?
          <a href="#" className="text-lime-400 hover:underline">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
}

export default Login;
