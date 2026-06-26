import axios from "axios"

export const api = axios.create({
  baseURL: "https://base2b.online:3300",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})