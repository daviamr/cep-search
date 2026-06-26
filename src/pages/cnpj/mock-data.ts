import type { CnpjBulkFile } from "./types"

export const cnpjBulkFilesMock: CnpjBulkFile[] = [
  {
    id: "1",
    fileName: "cnpjs-marco-2025.xlsx",
    sizeMb: 1.24,
    consultas: 2500,
    enderecos: 4821,
    validos: 4310,
    invalidos: 37,
    createdAt: new Date("2025-03-10T14:32:00"),
  },
  {
    id: "2",
    fileName: "base-clientes-sp.csv",
    sizeMb: 0.48,
    consultas: 890,
    enderecos: 1640,
    validos: 1488,
    invalidos: 12,
    createdAt: new Date("2025-03-08T09:15:00"),
  },
  {
    id: "3",
    fileName: "consulta-empresas-rj.xlsx",
    sizeMb: 2.87,
    consultas: 5200,
    enderecos: 9103,
    validos: 8234,
    invalidos: 84,
    createdAt: new Date("2025-03-05T16:48:00"),
  },
]
