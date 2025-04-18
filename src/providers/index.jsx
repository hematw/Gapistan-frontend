import React from "react";
import ThemeProvider from "./ThemeProvider";
import { HeroUIProvider } from "@heroui/system";
import SocketProvider from "./SocketProvider";

function Providers({ children }) {
  return (
    <ThemeProvider>
      <HeroUIProvider>
        <SocketProvider>{children}</SocketProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}

export default Providers;
