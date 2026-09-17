import { useId, useRef, useState, type DragEvent } from 'react'
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react'

import { HoverCard } from '@/components/hover-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatSpreadsheetColumnLabel } from '@/utils/file-headers.util'

const DEFAULT_ACCEPT = '.csv,.xls,.xlsx'
const EMPTY_COLUMN_VALUE = '__none__'

function getAcceptedExtensionsLabel(accept: string) {
  return accept
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join(', ')
}

function isAcceptedFile(file: File, accept: string) {
  const extensions = accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)

  const fileName = file.name.toLowerCase()

  return extensions.some((extension) => {
    if (extension.startsWith('.')) {
      return fileName.endsWith(extension)
    }

    return file.type === extension
  })
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${bytes} B`
}

export type UploadFilesColumnSelect = {
  label: string
  placeholder: string
  options: Array<string>
  value: string | null
  onChange: (value: string | null) => void
  required?: boolean
  emptyOptionLabel?: string
  description?: string
  disabled?: boolean
}

function isColumnSelectValid(select: UploadFilesColumnSelect) {
  if (select.disabled) {
    return true
  }

  if (select.required === false) {
    return select.value === null || select.options.includes(select.value)
  }

  return select.value !== null && select.options.includes(select.value)
}

function ColumnSelectField({
  select,
  inputId,
  disabled,
  invalid,
}: {
  select: UploadFilesColumnSelect
  inputId: string
  disabled: boolean
  invalid?: boolean
}) {
  const isOptional = select.required === false
  const selectValue = select.value ?? (isOptional ? EMPTY_COLUMN_VALUE : '')

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{select.label}</Label>
      {select.description ? (
        <p className="text-xs text-muted-foreground">{select.description}</p>
      ) : null}

      <Select
        value={selectValue}
        onValueChange={(value) => {
          if (value === EMPTY_COLUMN_VALUE) {
            select.onChange(null)
            return
          }

          select.onChange(value || null)
        }}
        disabled={disabled || select.disabled}
      >
        <SelectTrigger id={inputId} className="w-full bg-background" aria-invalid={invalid}>
          <SelectValue placeholder={select.placeholder} />
        </SelectTrigger>

        <SelectContent>
          {isOptional ? (
            <SelectItem value={EMPTY_COLUMN_VALUE}>{select.emptyOptionLabel ?? 'Não usar'}</SelectItem>
          ) : null}
          {select.options.map((option) => (
            <SelectItem key={option} value={option}>
              {formatSpreadsheetColumnLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {invalid ? (
        <p role="alert" className="text-xs text-destructive">
          {select.placeholder}
        </p>
      ) : null}
    </div>
  )
}

export type UploadFilesProps = {
  trigger: React.ReactNode
  title?: string
  description?: string
  accept?: string
  submitLabel?: string
  cancelLabel?: string
  fileInputLabel?: string
  fileInputPlaceholder?: string
  clearButtonHoverContent?: string
  columnSelect?: UploadFilesColumnSelect
  extraColumnSelects?: UploadFilesColumnSelect[]
  disabled?: boolean
  loading?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onFileChange?: (file: File | null) => void
  onSubmit?: (file: File) => void | Promise<void>
  className?: string
}

export function UploadFiles({
  trigger,
  title = 'Upload de arquivo',
  description = 'Selecione um arquivo .csv ou .xls para importar.',
  accept = DEFAULT_ACCEPT,
  submitLabel = 'Enviar',
  cancelLabel = 'Cancelar',
  fileInputLabel = 'Arquivo',
  fileInputPlaceholder = 'Nenhum arquivo selecionado',
  clearButtonHoverContent = 'Limpar arquivo selecionado',
  columnSelect,
  extraColumnSelects = [],
  disabled = false,
  loading = false,
  open,
  onOpenChange,
  onFileChange,
  onSubmit,
  className,
}: UploadFilesProps) {
  const inputId = useId()
  const errorId = useId()
  const fileNameId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const [internalOpen, setInternalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const isBusy = disabled || loading

  const setDialogOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value)
    }

    onOpenChange?.(value)

    if (!value) {
      resetFileState()
    }
  }

  const resetFileState = () => {
    setSelectedFile(null)
    setError(null)
    setIsDragging(false)

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    onFileChange?.(null)
  }

  const applyFile = (file: File | undefined) => {
    if (!file) {
      setSelectedFile(null)
      setError(null)
      onFileChange?.(null)
      return
    }

    if (!isAcceptedFile(file, accept)) {
      setSelectedFile(null)
      setError(`Formato inválido. Envie apenas arquivos ${getAcceptedExtensionsLabel(accept)}.`)
      onFileChange?.(null)

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      return
    }

    setSelectedFile(file)
    setError(null)
    onFileChange?.(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyFile(event.target.files?.[0])
  }

  const handleClear = () => {
    resetFileState()
  }

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (isBusy) return
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (isBusy) return
    applyFile(event.dataTransfer.files?.[0])
  }

  const hasFile = Boolean(selectedFile)
  const columnSelects = [columnSelect, ...extraColumnSelects].filter(
    (select): select is UploadFilesColumnSelect => Boolean(select),
  )
  const hasValidColumnSelection = columnSelects.every(isColumnSelectValid)

  const handleSubmit = async () => {
    if (!selectedFile || !onSubmit || !hasValidColumnSelection) return

    try {
      await onSubmit(selectedFile)
      setDialogOpen(false)
    } catch {
      // O erro é tratado pelo chamador (ex.: toast no controller).
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {trigger}
      </DialogTrigger>

      <DialogContent className={cn('sm:max-w-lg', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={inputId}>{fileInputLabel}</Label>

            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept={accept}
              disabled={isBusy}
              aria-invalid={Boolean(error)}
              aria-describedby={cn(fileNameId, error && errorId)}
              className="sr-only"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileSpreadsheet className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p id={fileNameId} className="truncate text-sm font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <HoverCard content={clearButtonHoverContent} side="top">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isBusy}
                    aria-label={clearButtonHoverContent}
                    onClick={handleClear}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </HoverCard>
              </div>
            ) : (
              <label
                htmlFor={inputId}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors',
                  isBusy
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:border-primary/50 hover:bg-primary/5',
                  isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
                  error && 'border-destructive/50',
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="size-4" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Arraste o arquivo ou clique para selecionar</p>
                  <p id={fileNameId} className="text-xs text-muted-foreground">
                    Formatos aceitos: {getAcceptedExtensionsLabel(accept)}
                  </p>
                  <span className="sr-only">{fileInputPlaceholder}</span>
                </div>
              </label>
            )}

            {error ? (
              <p id={errorId} role="alert" className="text-xs text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          {columnSelect && hasFile ? (
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-3">
              <ColumnSelectField
                select={{
                  ...columnSelect,
                  description:
                    columnSelect.description ??
                    'Escolha a coluna da planilha que contém os documentos da consulta.',
                }}
                inputId={`${inputId}-column`}
                disabled={isBusy}
                invalid={!isColumnSelectValid(columnSelect)}
              />

              {extraColumnSelects.map((select, index) => (
                <ColumnSelectField
                  key={`${select.label}-${index}`}
                  select={select}
                  inputId={`${inputId}-column-extra-${index}`}
                  disabled={isBusy}
                  invalid={!isColumnSelectValid(select)}
                />
              ))}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => setDialogOpen(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={!hasFile || isBusy || !onSubmit || !hasValidColumnSelection}
            onClick={handleSubmit}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
