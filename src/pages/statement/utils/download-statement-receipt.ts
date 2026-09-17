import { jsPDF } from 'jspdf'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { getAuthUser } from '@/lib/auth-token'
import { moneyFormat } from '@/utils/money.util'

import { STATEMENT_TYPE_LABELS, type StatementRecord } from '../types'

const PAGE_WIDTH = 210
const MARGIN_X = 20
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2
const CARD_X = 12
const CARD_TOP = 18

function drawLabelValue(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  options?: { valueColor?: string; valueBold?: boolean; maxValueWidth?: number },
) {
  const maxValueWidth = options?.maxValueWidth ?? 110

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text(label, MARGIN_X, y)

  doc.setFont('helvetica', options?.valueBold ? 'bold' : 'normal')
  doc.setFontSize(11)
  if (options?.valueColor) {
    const [r, g, b] = options.valueColor.split(',').map(Number) as [number, number, number]
    doc.setTextColor(r, g, b)
  } else {
    doc.setTextColor(24, 24, 27)
  }

  const lines = doc.splitTextToSize(value, maxValueWidth) as string[]
  doc.text(lines, PAGE_WIDTH - MARGIN_X, y, { align: 'right' })

  return y + Math.max(10, lines.length * 5 + 5)
}

export function downloadStatementReceipt(record: StatementRecord) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const user = getAuthUser()
  const typeLabel = STATEMENT_TYPE_LABELS[record.type]
  const isPositive = record.amount > 0
  const amountColor = isPositive ? '5,150,105' : '113,113,122'
  const generatedAt = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  const movementAt = format(record.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  const safeDescription = record.description
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  const fileName = `comprovante-${safeDescription || record.id}.pdf`

  // Header bar
  doc.setFillColor(212, 160, 23)
  doc.roundedRect(CARD_X, CARD_TOP, PAGE_WIDTH - 24, 22, 3, 3, 'F')
  doc.rect(CARD_X, 28, PAGE_WIDTH - 24, 12, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Busca Endereço', MARGIN_X, 31)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Comprovante de movimentação', PAGE_WIDTH - MARGIN_X, 31, { align: 'right' })

  let y = 52

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(24, 24, 27)
  doc.text('Comprovante', MARGIN_X, y)

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text(`Protocolo #${record.id}`, MARGIN_X, y)

  y += 10
  doc.setDrawColor(228, 228, 231)
  doc.setLineWidth(0.2)
  doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y)

  y += 12
  y = drawLabelValue(doc, 'Data da movimentação', movementAt, y)
  y = drawLabelValue(doc, 'Tipo', typeLabel, y)
  y = drawLabelValue(doc, 'Descrição', record.description, y)

  if (user) {
    y = drawLabelValue(doc, 'Titular', user.name, y)
    y = drawLabelValue(doc, 'E-mail', user.email, y)
  }

  y += 2
  doc.setDrawColor(228, 228, 231)
  doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y)
  y += 12

  y = drawLabelValue(doc, 'Valor', moneyFormat(record.amount), y, {
    valueColor: amountColor,
    valueBold: true,
  })
  y = drawLabelValue(doc, 'Saldo após movimentação', moneyFormat(record.balanceAfter), y, {
    valueBold: true,
  })

  y += 8
  doc.setFillColor(isPositive ? 236 : 244, isPositive ? 253 : 244, isPositive ? 245 : 245)
  doc.roundedRect(MARGIN_X, y, CONTENT_WIDTH, 18, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(isPositive ? 5 : 113, isPositive ? 150 : 113, isPositive ? 105 : 122)
  doc.text(
    isPositive ? 'Crédito adicionado à carteira' : 'Crédito debitado da carteira',
    PAGE_WIDTH / 2,
    y + 11,
    { align: 'center' },
  )

  y += 28
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(161, 161, 170)
  doc.text(`Documento gerado em ${generatedAt} • Busca Endereço`, PAGE_WIDTH / 2, y, {
    align: 'center',
  })
  doc.text(
    'Este comprovante é apenas informativo e não possui valor fiscal.',
    PAGE_WIDTH / 2,
    y + 5,
    { align: 'center' },
  )

  const cardBottom = y + 12
  const cardHeight = cardBottom - CARD_TOP

  doc.setDrawColor(228, 228, 231)
  doc.setLineWidth(0.3)
  doc.roundedRect(CARD_X, CARD_TOP, PAGE_WIDTH - 24, cardHeight, 3, 3, 'S')

  doc.save(fileName)
}
