import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/system";
import SocketProvider from "./contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </HeroUIProvider>
  </StrictMode>
);
