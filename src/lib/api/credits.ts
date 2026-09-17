import { authApi } from "@/lib/api/axios"

export type ActiveBonusApi = {
  expires_at: string
  id: string
  is_available: boolean
  original_amount: string
  reason: string
  remaining_amount: string
}

export type MeCreditsApi = {
  credits: string
  active_bonuses: ActiveBonusApi[]
}

export async function getMeCredits() {
  const { data } = await authApi.get<MeCreditsApi>("/api/v1/me/credits")

  return data
}
