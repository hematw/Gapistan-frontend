import { Button } from "@heroui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosIns from "@/utils/axios";
import { addToast } from "@heroui/toast";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { InputOtp } from "@heroui/input-otp";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [pendingSignUp, setPendingSignUp] = useState(() => {
    const pendingSp = localStorage.getItem("pendingSignUp");
    if (pendingSp) {
      return JSON.parse(pendingSp);
    }
  });

  const handleVerify = async (e) => {
    e.preventDefault()
    const pendingSignUp = JSON.parse(localStorage.getItem("pendingSignUp"));

    try {
      // Verify OTP
      const { data } = await axiosIns.post("/auth/verify-otp", {
        email: pendingSignUp.email,
        otp,
      });

      // Signup only after OTP is verified
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("pendingSignUp");

      addToast({ title: "Signup Successful", color: "success" });
      navigate("/chat");
    } catch (err) {
      console.error(err);
      addToast({ title: "Invalid OTP", color: "danger" });
    }
  };

  if(!pendingSignUp){
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="mx-auto p-6 border w-full max-w-md">
        <CardHeader className="text-center">
          <p className="font-medium text-2xl">Verify OTP</p>
        </CardHeader>
        <CardHeader className="text-gray-600 text-center">
          Enter the OTP sent to your email
        </CardHeader>

        <CardBody>
          <form className="space-y-5" onSubmit={handleVerify}>
            <div className="grid place-content-center">
              <InputOtp
                length={6}
                size="lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="faded"
                label="Username"
                type="text"
                id="username"
                required
              />
            </div>

            <Button
              fullWidth
              type="submit"
              className="bg-lime-500 hover:bg-300 dark:hover:bg-lime-400 py-2 rounded-xl w-full font-semibold text-white dark:text-black transition duration-300"
            >
              Verify
            </Button>
          </form>
        </CardBody>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Already have an account?
          <Link to="/signup" className="text-lime-500 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
