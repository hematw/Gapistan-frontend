import axiosIns from "@/utils/axios";
import { addToast } from "@heroui/toast";
import { isAxiosError } from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logout: () => {},
  user: null,
  isLoggedIn: false,
});

export default function AuthProvider({ children }) {
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
      addToast({
        title: "Success",
        description: "Login successful!",
        color: "success",
      });
      navigate("/chat", { replace: true });
    } catch (error) {
      if (isAxiosError(error) && error?.status == 401) {
        console.error("Unauthorized");
        addToast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          color: "danger",
        });
      }
      console.error(error);
    }
  }

  async function signUp(values) {
    try {
      const { data } = await axiosIns.post("/auth/register", values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.createdUser));
      setUser(data.createdUser);
      navigate("/chat");
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
    <AuthContext.Provider value={{ signIn, logout, signUp, user, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
