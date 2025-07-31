"use client";

import React, { useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
