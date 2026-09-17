import { authApi } from "@/lib/api/axios"
import type { UserRole } from "@/enums/user-role.enum"

export type UserApi = {
  id: string
  name: string
  email: string
  role: UserRole
  client_id: string | null
  created_at: string
  updated_at: string
}

export type CreateUserRequest = {
  name: string
  email: string
  password: string
  role: UserRole
}

export async function createUser(body: CreateUserRequest) {
  const { data } = await authApi.post<UserApi>("/api/v1/users", body)

  return data
}

export async function listUsers() {
  const { data } = await authApi.get<UserApi[]>("/api/v1/users")

  return data
}

export type DeleteUserResponse = {
  message: string
}

export async function deleteUser(userId: string) {
  const { data } = await authApi.delete<DeleteUserResponse>(`/api/v1/users/${userId}`)

  return data
}

export type MeCreditsHistoryApi = {
  id: number
  client_id: string
  type: string
  reason: string
  amount: string
  description: string
  previous_balance: string
  new_balance: string
  reserved_credits: string
  available_credits: string
  created_at: string
}

export async function listMeCreditsHistory() {
  const { data } = await authApi.get<MeCreditsHistoryApi[]>(
    "/api/v1/users/me/credits/history"
  )

  return data
}
