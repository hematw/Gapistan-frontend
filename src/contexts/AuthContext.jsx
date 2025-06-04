import axiosIns from "@/utils/axios";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateECDHKeyPair, exportPublicKey } from "@/utils/crypto";
import { storePrivateKey } from "@/services/keyManager";

async function setupKeysAndSendToServer(userId) {
  try {
    
    const { publicKey, privateKey } = await generateECDHKeyPair();
    
    // Store private key in IndexedDB
    await storePrivateKey(privateKey);
    
    // Export public key and send to backend
    const exportedPublicKey = await exportPublicKey(publicKey);
    await axiosIns.put("/users/public-key", {
      userId,
      publicKey: exportedPublicKey,
    });
  } catch (error) {
    console.error("Error setting up keys:", error);
    addToast({
      title: "Key Setup Failed",
      description: "Failed to set up encryption keys. Please try again.",
      color: "danger",
    });
  }
}

const AuthContext = createContext({
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logout: () => {},
  user: null,
  isLoggedIn: false,
});

export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  });
  const isLoggedIn = !!user;

  const navigate = useNavigate();

  async function logout() {
    queryClient.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }

  async function signIn(values) {
    try {
      const { data } = await axiosIns.post("/auth/signin", values);
      console.log(data);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      await setupKeysAndSendToServer(data.user._id);

      addToast({
        title: "Success",
        description: "Login successful!",
        color: "success",
      });
      navigate("/chat", { replace: true });
    } catch (error) {
      addToast({
        title: "Login Failed",
        description:
          error?.response?.data.message ||
          "Invalid credentials. Please try again.",
        color: "danger",
      });
      if (isAxiosError(error) && error?.status == 401) {
        console.error("Unauthorized");
      }
      console.error(error);
    }
  }

  async function signUp(values) {
    try {
      const { data } = await axiosIns.post("/auth/signup", values);
      localStorage.setItem("pendingSignUp", JSON.stringify(data));
      // setUser(data.createdUser);
      navigate("/verify-otp");
    } catch (error) {
      console.error("Error", error);
      addToast({
        title: "Register Failed",
        description: "Something went wrong, Please try again later.",
        color: "primary",
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, logout, signUp, user, isLoggedIn, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
