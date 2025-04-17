import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

let socketInstance = null;

const SocketContext = createContext();

function SocketProvider({ children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    if (!socketInstance && !socketInstance?.connected) {
      socketInstance = io("http://localhost:3000/");
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

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
