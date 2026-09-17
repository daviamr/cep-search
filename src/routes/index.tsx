import { useRoutes } from "react-router-dom"

import { useAuth } from "@/context/auth-provider"

import { appRoutes } from "./app.routes"
import { authRoutes } from "./auth.routes"

export function Routes() {
  const { isAuthenticated } = useAuth()
  const routes = isAuthenticated ? appRoutes : authRoutes

  return useRoutes(routes)
}
