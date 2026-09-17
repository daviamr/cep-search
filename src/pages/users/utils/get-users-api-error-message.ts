import { isAxiosError } from "axios"

export function getUsersApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined

    if (data?.error) {
      return data.error
    }

    if (data?.message) {
      return data.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
