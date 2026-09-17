import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { Spinner } from "@/components/ui/spinner"
import { clearAuthTokens, getRefreshToken } from "@/lib/auth-token"
import { performTokenRefresh } from "@/lib/token-refresh"

type SessionBootstrapContextValue = {
  isSessionReady: boolean
}

const SessionBootstrapContext = createContext<SessionBootstrapContextValue>({
  isSessionReady: false,
})

export function useSessionBootstrap() {
  return useContext(SessionBootstrapContext)
}

type SessionBootstrapProps = {
  children: ReactNode
}

export function SessionBootstrap({ children }: SessionBootstrapProps) {
  const [isSessionReady, setIsSessionReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function bootstrapSession() {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        if (!cancelled) {
          setIsSessionReady(true)
        }

        return
      }

      try {
        await performTokenRefresh(refreshToken)
      } catch {
        clearAuthTokens()
      } finally {
        if (!cancelled) {
          setIsSessionReady(true)
        }
      }
    }

    void bootstrapSession()

    return () => {
      cancelled = true
    }
  }, [])

  if (!isSessionReady) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <Spinner className="size-8" />
        <p className="text-sm">carregando...</p>
      </div>
    )
  }

  return (
    <SessionBootstrapContext.Provider value={{ isSessionReady }}>
      {children}
    </SessionBootstrapContext.Provider>
  )
}
