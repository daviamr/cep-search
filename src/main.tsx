import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/context/auth-provider.tsx"
import { SessionBootstrap } from "@/context/session-bootstrap.tsx"
import { SessionProvider } from "@/context/session-provider.tsx"
import { queryClient } from "@/lib/query-client.ts"
import { Routes } from "@/routes"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <AuthProvider>
            <SessionBootstrap>
              <SessionProvider>
                <Routes />
                <Toaster richColors position="top-right" />
              </SessionProvider>
            </SessionBootstrap>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
