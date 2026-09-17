import axios from "axios"

import { env } from "@/env"
import { getRefreshToken, setAuthTokens } from "@/lib/auth-token"

export type RefreshTokenResponse = {
  access_token: string
  refresh_token: string
}

const refreshClient = axios.create({
  baseURL: env.VITE_API_BASE,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

let refreshPromise: Promise<RefreshTokenResponse> | null = null

export async function performTokenRefresh(
  refreshToken?: string
): Promise<RefreshTokenResponse> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    const token = refreshToken ?? getRefreshToken()

    if (!token) {
      throw new Error("Refresh token não encontrado")
    }

    const { data } = await refreshClient.post<RefreshTokenResponse>(
      "/api/v1/auth/refresh",
      {
        refresh_token: token,
      }
    )

    setAuthTokens(data.access_token, data.refresh_token)

    return data
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}
