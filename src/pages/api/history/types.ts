export type ApiHistoryStatus = "success" | "error" | "processing"

export type ApiHistoryRecord = {
  id: string
  endpoint: string
  method: "GET" | "POST" | "DELETE"
  status: ApiHistoryStatus
  statusCode: number
  credits: number
  origin: string
  createdAt: Date
}
