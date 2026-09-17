export function bytesToMb(sizeInBytes: number | string | null | undefined): number {
  const numericSize = Number(sizeInBytes)

  if (!Number.isFinite(numericSize) || numericSize <= 0) {
    return 0
  }

  return numericSize / (1024 * 1024)
}

export function formatSizeMb(sizeInMb: number | string | null | undefined): string {
  const numericSize = Number(sizeInMb)

  if (!Number.isFinite(numericSize) || numericSize < 0) {
    return '0 MB'
  }

  return `${numericSize.toFixed(2)} MB`
}
