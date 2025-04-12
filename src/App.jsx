import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import ICGChat from "./components/Chat";

let newSocket;

function App() {
  // const [socket, setSocket] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);

  // const sendMessage = () => {
  //   if (!socket) {
  //     console.log("Socket not initialized");
  //     return;
  //   }
  //   console.log("Sending message");
  //   socket.emit("message", "Hello World!");
  // };

  // useEffect(() => {
  //   if (!newSocket) {
  //     newSocket = io("http://localhost:3000/");
  //   }

  //   newSocket.on("connect", () => {
  //     console.log("Connected to server as", newSocket.id);
  //     setIsConnected(true);
  //     newSocket.emit("userOnline", newSocket.id);
  //   });

  //   newSocket.on("message", (data) => {
  //     console.log(data);
  //   });

  //   newSocket.on("connect_error", (err) => {
  //     console.error("Socket connection error:", err);
  //   });

  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.off("connect");
  //     newSocket = null;
  //   };
  // }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {/* <div className="text-center">
        <h1 className="text-red-400 text-5xl font-semibold">Hello World!</h1>
        <button onClick={sendMessage}>Send Message</button>
        <p
          className={`${
            isConnected ? "bg-green-500" : "bg-red-500"
          } text-white rounded-2xl mt-6`}
        >
          {isConnected ? "Connected" : "Not Connected"}
        </p>
      </div> */}
      <ICGChat/>
    </div>
  );
}

export default App;
