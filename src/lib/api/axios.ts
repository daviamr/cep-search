import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"

import { env } from "@/env"
import { getAccessToken, getRefreshToken } from "@/lib/auth-token"
import { notifyUnauthorized } from "@/lib/session-unauthorized"
import { performTokenRefresh } from "@/lib/token-refresh"

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

export const authApi = axios.create({
  baseURL: env.VITE_API_BASE,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

export const sociosApi = axios.create({
  baseURL: env.VITE_SOCIOS_API_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]
  }

  return config
})

authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

sociosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]
  }

  return config
})

const AUTH_PUBLIC_PATHS = ["/api/v1/auth/login", "/api/v1/auth/refresh"]

function isAuthPublicRequest(config?: InternalAxiosRequestConfig) {
  const url = config?.url ?? ""

  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path))
}

let refreshPromise: Promise<string> | null = null

async function getRefreshedAccessToken() {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh()
      .then((data) => data.access_token)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

function createUnauthorizedInterceptor(client: AxiosInstance) {
  return async (error: AxiosError) => {
    const originalConfig = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status

    if (status !== 401 || !originalConfig || isAuthPublicRequest(originalConfig)) {
      return Promise.reject(error)
    }

    if (originalConfig._retry) {
      notifyUnauthorized()
      return Promise.reject(error)
    }

    if (!getRefreshToken()) {
      notifyUnauthorized()
      return Promise.reject(error)
    }

    originalConfig._retry = true

    try {
      const accessToken = await getRefreshedAccessToken()
      originalConfig.headers.Authorization = `Bearer ${accessToken}`
      return client(originalConfig)
    } catch {
      notifyUnauthorized()
      return Promise.reject(error)
    }
  }
}

api.interceptors.response.use((response) => response, createUnauthorizedInterceptor(api))
authApi.interceptors.response.use(
  (response) => response,
  createUnauthorizedInterceptor(authApi)
)
sociosApi.interceptors.response.use(
  (response) => response,
  createUnauthorizedInterceptor(sociosApi)
)
