import { z } from "zod"

const ACCEPTED_BULK_EXTENSIONS = [".csv", ".xlsx", ".xls"] as const

function stripNonDigits(value: string) {
  return value.replace(/\D/g, "")
}

function isAcceptedSpreadsheet(file: File) {
  const name = file.name.toLowerCase()
  return ACCEPTED_BULK_EXTENSIONS.some((extension) => name.endsWith(extension))
}

export const simpleSearchSchema = z.object({
  cep: z
    .string()
    .min(1, "Informe um CEP")
    .transform(stripNonDigits)
    .pipe(z.string().length(8, "CEP deve conter 8 dígitos")),
  numero: z.string().optional(),
  complemento: z.string().optional(),
})

export const bulkSearchSchema = z.object({
  file: z
    .instanceof(File, { message: "Selecione um arquivo" })
    .refine(isAcceptedSpreadsheet, {
      message: "Formato inválido. Envie um arquivo .csv ou .xlsx",
    }),
})

export type SimpleSearchInput = z.input<typeof simpleSearchSchema>
export type SimpleSearchValues = z.output<typeof simpleSearchSchema>
export type BulkSearchInput = z.input<typeof bulkSearchSchema>
export type BulkSearchValues = z.output<typeof bulkSearchSchema>

export const BULK_SEARCH_ACCEPT = ".csv,.xlsx,.xls"
