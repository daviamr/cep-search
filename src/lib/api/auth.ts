import { authApi } from "@/lib/api/axios"
import { setAuthTokens, setAuthUser, type AuthUser } from "@/lib/auth-token"

export type SignInRequest = {
  email: string
  password: string
}

export type SignInUser = AuthUser

export type SignInResponse = {
  access_token: string
  refresh_token: string
  user: SignInUser
}

export async function signIn({ email, password }: SignInRequest) {
  const { data } = await authApi.post<SignInResponse>("/api/v1/auth/login", {
    email,
    password,
  })

  setAuthTokens(data.access_token, data.refresh_token)
  setAuthUser(data.user)

  return data
}
