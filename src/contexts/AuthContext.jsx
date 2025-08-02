import axiosIns from "@/utils/axios";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateECDHKeyPair, exportPublicKey } from "@/utils/crypto";
import { storePrivateKey } from "@/services/keyManager";
import { generateAndSaveRSAKeys } from "../utils/crypto";
import { getPrivateKey, getRsaPrivateKey } from "../services/keyManager";

async function setupKeysAndSendToServer(userId) {
  const keyPair = await generateECDHKeyPair();
  const publicJwk = await exportPublicKey(keyPair.publicKey);

  await storePrivateKey(userId, keyPair.privateKey);

  await axiosIns.put("/users/public-key", { publicKey: publicJwk });
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
    // await deletePrivateKey(user?._id);
    setUser(null);
  }

  async function signIn(values) {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/signin",
        values
      );
      console.log(data);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const aesKey = await getPrivateKey(data.user._id);
      const rsaKey = await getRsaPrivateKey(data.user._id);

      if (!aesKey) {
        await setupKeysAndSendToServer(data.user._id);
      }

      if (!rsaKey) {
        await generateAndSaveRSAKeys(data.user._id);
      }
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
      if(error.status === 409){
        return addToast({
          title: "Email or username already registered",
          description: "Please try with different email or username.",
          color: "warning",
        });

      }
      addToast({
        title: "Register Failed",
        description: "Something went wrong, Please try again later.",
        color: "danger",
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
