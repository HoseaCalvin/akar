import axios from "axios"

export const endpoint = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
})