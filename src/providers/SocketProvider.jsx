import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "../contexts/SocketContext";

let socketInstance = null;

function SocketProvider({ children }) {
  const [socket, setSocket] = useState();

  const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

  useEffect(() => {
    if (!socketInstance && !socketInstance?.connected) {
      socketInstance = io(VITE_SOCKET_URL || "http://localhost:3000/");
      setSocket(socketInstance);
    }

    socketInstance.on("connect", () => {
      console.log("Socket connection established!");
      console.log("closed ", socketInstance?.connected);
    });

    socketInstance.on("disconnect", () => console.log("socket disconnected"));

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socketInstance.off("message");
      socketInstance.off("connect_error");
      console.log("closed ", socketInstance?.connected);
      socketInstance = null;
    };
  }, []);

  const playSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch(() => {
      console.log("Audio initialized after user interaction.");
    });
  };

  return (
    <SocketContext.Provider value={{ socket, playSound }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
