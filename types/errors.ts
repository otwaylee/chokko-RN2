// src/types/errors.ts

export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string
    }
    status?: number
  }
  message: string
}
