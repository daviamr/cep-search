import { authApi } from "@/lib/api/axios"

export type ClientBonusApi = {
  expires_at: string
  id: string
  is_available: boolean
  original_amount: string
  reason: string
  remaining_amount: string
}

export type ClientApi = {
  id: string
  name: string
  credits: string
  created_at: string
  updated_at: string
  active_bonuses?: ClientBonusApi[]
}

export async function listClients() {
  const { data } = await authApi.get<ClientApi[]>("/api/v1/clients")

  return data
}
