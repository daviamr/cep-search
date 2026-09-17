import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || URL.canParse(value), "Invalid URL")

const envSchema = z.object({
  VITE_API_URL: optionalUrl,
  VITE_API_BASE: optionalUrl,
  VITE_SOCIOS_API_URL: optionalUrl,
})

const _env = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL ?? "",
  VITE_API_BASE: import.meta.env.VITE_API_BASE ?? "",
  VITE_SOCIOS_API_URL: import.meta.env.VITE_SOCIOS_API_URL ?? "",
})

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format())

  throw new Error("Invalid environment variables")
}

export const env = _env.data
