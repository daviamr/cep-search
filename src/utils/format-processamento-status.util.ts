const PROCESSAMENTO_STATUS_LABELS: Record<string, string> = {
  aguardando: 'Aguardando',
  pending: 'Aguardando',
  processando: 'Processando',
  processing: 'Processando',
  concluido: 'Concluído',
  concluida: 'Concluído',
  completed: 'Concluído',
  done: 'Concluído',
  concluido_parcial: 'Concluído',
  erro: 'Erro',
  error: 'Erro',
  falhou: 'Falhou',
  failed: 'Falhou',
  cancelado: 'Cancelado',
}

const PROCESSAMENTO_ACCESSIBLE_STATUSES = new Set([
  'concluido',
  'concluida',
  'concluido_parcial',
  'completed',
  'done',
])

const PROCESSAMENTO_PENDING_STATUSES = new Set([
  'aguardando',
  'pending',
  'processando',
  'processing',
])

export function formatProcessamentoStatus(status: string): string {
  const normalized = status.trim().toLowerCase()

  if (!normalized) {
    return '—'
  }

  return PROCESSAMENTO_STATUS_LABELS[normalized] ?? status
}

export function isProcessamentoPending(status: string): boolean {
  return PROCESSAMENTO_PENDING_STATUSES.has(status.trim().toLowerCase())
}

export function canAccessProcessamentoResults(status: string): boolean {
  return PROCESSAMENTO_ACCESSIBLE_STATUSES.has(status.trim().toLowerCase())
}
