import { format, isValid } from 'date-fns'

export function formatDateAndHours(value: Date | string | number | null | undefined): string {
  if (value == null || value === '') return ''

  const date = value instanceof Date ? value : new Date(value)

  if (!isValid(date)) return ''

  return format(date, 'dd/MM/yy, HH:mm')
}

export function formatDateOnly(value: Date | string | number | null | undefined): string {
  if (value == null || value === '') return ''

  const date = value instanceof Date ? value : new Date(value)

  if (!isValid(date)) return ''

  return format(date, 'dd/MM/yyyy')
}
