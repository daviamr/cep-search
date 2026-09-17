'use client'

import * as React from 'react'
import { addDays, addMonths, addYears, format, startOfDay, subDays, subMonths, subYears } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, FilterX } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type DatePickerRangeValue = DateRange | undefined
export type DateDirection = 'past' | 'future' | 'all'

type PresetUnit = 'days' | 'months' | 'years'

type PresetOptionId = 'yesterday' | 'today' | '7-days' | '30-days' | '3-months' | '6-months' | '1-year'

type PresetOption = {
  id: PresetOptionId
  label: string
  amount?: number
  unit?: PresetUnit
}

type DatePickerWithRangeBaseProps = {
  label?: string
  placeholder?: string
  defaultDateDirection?: DateDirection
  className?: string
  id?: string
  disabled?: boolean
}

type DatePickerWithRangeControlledProps = DatePickerWithRangeBaseProps & {
  value: DatePickerRangeValue
  onChange: (range: DatePickerRangeValue) => void
  defaultValue?: never
}

type DatePickerWithRangeUncontrolledProps = DatePickerWithRangeBaseProps & {
  value?: never
  onChange?: (range: DatePickerRangeValue) => void
  defaultValue?: DatePickerRangeValue
}

export type DatePickerWithRangeProps = DatePickerWithRangeControlledProps | DatePickerWithRangeUncontrolledProps

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'yesterday', label: 'Ontem' },
  { id: 'today', label: 'Hoje', amount: 1, unit: 'days' },
  { id: '7-days', label: '7 dias', amount: 7, unit: 'days' },
  { id: '30-days', label: '30 dias', amount: 30, unit: 'days' },
  { id: '3-months', label: '3 meses', amount: 3, unit: 'months' },
  { id: '6-months', label: '6 meses', amount: 6, unit: 'months' },
  { id: '1-year', label: '1 ano', amount: 1, unit: 'years' },
]

function getOffsetDate(date: Date, amount: number, unit: PresetUnit, operation: 'add' | 'sub'): Date {
  if (unit === 'days') {
    return operation === 'add' ? addDays(date, amount) : subDays(date, amount)
  }

  if (unit === 'months') {
    return operation === 'add' ? addMonths(date, amount) : subMonths(date, amount)
  }

  return operation === 'add' ? addYears(date, amount) : subYears(date, amount)
}

function getPresetRange(amount: number, unit: PresetUnit, dateDirection: DateDirection): DateRange {
  const today = startOfDay(new Date())
  const offset = unit === 'days' ? amount - 1 : amount

  if (dateDirection === 'future') {
    return {
      from: today,
      to: getOffsetDate(today, offset, unit, 'add'),
    }
  }

  return {
    from: getOffsetDate(today, offset, unit, 'sub'),
    to: today,
  }
}

function getYesterdayRange(): DateRange {
  const yesterday = startOfDay(subDays(new Date(), 1))

  return { from: yesterday, to: yesterday }
}

function applyPresetOption(optionId: PresetOptionId, dateDirection: DateDirection): DatePickerRangeValue {
  if (optionId === 'yesterday') return getYesterdayRange()

  const option = PRESET_OPTIONS.find((preset) => preset.id === optionId)

  if (!option?.amount || !option.unit) return undefined

  return getPresetRange(option.amount, option.unit, dateDirection)
}

function formatDateRange(date: DatePickerRangeValue, placeholder: string): string {
  if (!date?.from) return placeholder

  const from = format(date.from, 'dd/MM/yyyy', { locale: ptBR })

  if (!date.to) return from

  const to = format(date.to, 'dd/MM/yyyy', { locale: ptBR })

  return `${from} - ${to}`
}

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const {
    label = 'Período',
    placeholder = 'Selecione um período',
    defaultDateDirection = 'all',
    className,
    id: idProp,
    disabled = false,
    value,
    defaultValue,
    onChange,
  } = props

  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const descriptionId = `${id}-description`
  const directionId = `${id}-direction`
  const presetId = `${id}-preset`

  const isControlled = 'value' in props
  const [internalDate, setInternalDate] = React.useState<DatePickerRangeValue>(defaultValue)
  const [dateDirection, setDateDirection] = React.useState<DateDirection>(defaultDateDirection)
  const [presetSelectKey, setPresetSelectKey] = React.useState(0)

  const date = isControlled ? value : internalDate

  const updateDate = React.useCallback(
    (range: DatePickerRangeValue) => {
      if (!isControlled) {
        setInternalDate(range)
      }

      onChange?.(range)
    },
    [isControlled, onChange],
  )

  const handleDirectionChange = (direction: DateDirection) => {
    setDateDirection(direction)
    updateDate(undefined)
  }

  const handlePresetChange = (optionId: PresetOptionId) => {
    updateDate(applyPresetOption(optionId, dateDirection))
    setPresetSelectKey((key) => key + 1)
  }

  const handleClear = () => {
    updateDate(undefined)
  }

  const hasDateSelected = Boolean(date?.from)
  const formattedRange = formatDateRange(date, placeholder)
  const disabledDays =
    dateDirection === 'past' ? { after: new Date() } : dateDirection === 'future' ? { before: new Date() } : undefined

  return (
    <Field className={cn('w-60 gap-1', className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-describedby={descriptionId}
            aria-label={date?.from ? `${label}: ${formattedRange}` : `${label}: ${placeholder}`}
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
            <span id={descriptionId}>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                    {format(date.to, 'dd/MM/yyyy', { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, 'dd/MM/yyyy', { locale: ptBR })
                )
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            locale={ptBR}
            defaultMonth={date?.from}
            selected={date}
            onSelect={updateDate}
            disabled={disabledDays}
            numberOfMonths={2}
          />
          <div className="flex flex-wrap items-end gap-2 border-t p-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={directionId} className="text-sm font-medium">
                Tipo de datas
              </label>
              <Select value={dateDirection} onValueChange={handleDirectionChange}>
                <SelectTrigger id={directionId} className="w-fit" size="sm">
                  <SelectValue placeholder="Selecione o tipo de datas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as datas</SelectItem>
                  <SelectItem value="past">Datas passadas</SelectItem>
                  <SelectItem value="future">Datas futuras</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={presetId} className="text-sm font-medium">
                Período rápido
              </label>
              <Select key={presetSelectKey} onValueChange={(value) => handlePresetChange(value as PresetOptionId)}>
                <SelectTrigger id={presetId} className="w-fit" size="sm">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <HoverCard openDelay={0.5} closeDelay={0.5}>
              <HoverCardTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Limpar filtros de data"
                  disabled={!hasDateSelected}
                  onClick={handleClear}
                >
                  <FilterX className="size-4" aria-hidden="true" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-auto p-2 text-xs">
                Limpar filtros de data
              </HoverCardContent>
            </HoverCard>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  )
}
