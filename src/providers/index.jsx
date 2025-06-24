import React from "react";
import ThemeProvider from "./ThemeProvider";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import AuthProvider from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Providers({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 1,
        cacheTime: 1000 * 60 * 1,
      },
    },
  });

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ReactQueryDevtools />
          <HeroUIProvider>
            <ToastProvider
              placement="top-center"
              toastProps={{
                variant: "solid",
                timeout: "3000",
              }}
            />
            {children}
          </HeroUIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default Providers;
