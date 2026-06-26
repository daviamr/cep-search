export function formatSizeMb(sizeInMb: number | null | undefined): string {
  const numericSize = Number(sizeInMb)

  if (!Number.isFinite(numericSize) || numericSize < 0) {
    return "0 MB"
  }

  if (numericSize >= 1) {
    return `${numericSize.toFixed(2)} MB`
  }

  const sizeInKb = numericSize * 1024
  if (sizeInKb >= 1) {
    return `${sizeInKb.toFixed(2)} KB`
  }

  return `${(sizeInKb * 1024).toFixed(0)} B`
}

export function formatDateAndHours(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function formatFileSize(bytes: number | null | undefined): string {
  const size = Number(bytes)

  if (!Number.isFinite(size) || size < 0) {
    return "0 B"
  }

  return formatSizeMb(size / (1024 * 1024))
}

export function formatDateTime(
  value: Date | string | number | null | undefined
): string {
  if (value == null || value === "") {
    return ""
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return ""
    }

    const timestamp = value > 1_000_000_000_000 ? value : value * 1000
    return formatDateAndHours(timestamp)
  }

  return formatDateAndHours(value)
}

/** @deprecated Use formatDateTime */
export function formatUnixTimestamp(
  value: Date | string | number | null | undefined
): string {
  return formatDateTime(value)
}

export function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, "")

  if (digits.length !== 8) {
    return cep
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "")

  if (digits.length !== 11) {
    return cpf
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}
