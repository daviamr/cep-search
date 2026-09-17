import { UserRole } from "@/enums/user-role.enum"

const ACCESS_TOKEN_KEY = "busca-endereco:access-token"
const REFRESH_TOKEN_KEY = "busca-endereco:refresh-token"
const USER_KEY = "busca-endereco:user"
export const AUTH_CHANGED_EVENT = "auth:changed"

export type AuthUser = {
  email: string
  id: string
  name: string
  role: UserRole
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  notifyAuthChanged()
}

export function setAuthUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  notifyAuthChanged()
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  notifyAuthChanged()
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}
