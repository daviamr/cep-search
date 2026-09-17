/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import {
  AUTH_CHANGED_EVENT,
  clearAuthTokens,
  getAuthUser,
  isAuthenticated,
  type AuthUser,
} from "@/lib/auth-token"

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated)
  const [user, setUser] = useState<AuthUser | null>(getAuthUser)

  useEffect(() => {
    function syncAuthState() {
      setAuthenticated(isAuthenticated())
      setUser(getAuthUser())
    }

    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState)
    window.addEventListener("storage", syncAuthState)

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState)
      window.removeEventListener("storage", syncAuthState)
    }
  }, [])

  function signOut() {
    clearAuthTokens()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
