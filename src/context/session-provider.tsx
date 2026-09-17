/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useAuth } from "@/context/auth-provider"
import { getAccessToken } from "@/lib/auth-token"
import { setUnauthorizedHandler } from "@/lib/session-unauthorized"

const SESSION_EXPIRED_TOAST_DURATION_MS = 3000

type SessionContextValue = {
  expireSession: () => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { signOut, isAuthenticated } = useAuth()
  const isHandlingRef = useRef(false)

  const expireSession = useCallback(() => {
    if (isHandlingRef.current || !isAuthenticated) {
      return
    }

    isHandlingRef.current = true

    toast.error("Sessão expirada. Faça login novamente.", {
      duration: SESSION_EXPIRED_TOAST_DURATION_MS,
    })

    window.setTimeout(() => {
      signOut()
      navigate("/", { replace: true })
      isHandlingRef.current = false
    }, SESSION_EXPIRED_TOAST_DURATION_MS)
  }, [isAuthenticated, navigate, signOut])

  useEffect(() => {
    setUnauthorizedHandler(expireSession)

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [expireSession])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    function handleMissingToken() {
      if (!getAccessToken()) {
        expireSession()
      }
    }

    handleMissingToken()

    window.addEventListener("storage", handleMissingToken)
    window.addEventListener("focus", handleMissingToken)
    document.addEventListener("visibilitychange", handleMissingToken)

    const intervalId = window.setInterval(handleMissingToken, 2000)

    return () => {
      window.removeEventListener("storage", handleMissingToken)
      window.removeEventListener("focus", handleMissingToken)
      document.removeEventListener("visibilitychange", handleMissingToken)
      window.clearInterval(intervalId)
    }
  }, [expireSession, isAuthenticated])

  return <SessionContext.Provider value={{ expireSession }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
