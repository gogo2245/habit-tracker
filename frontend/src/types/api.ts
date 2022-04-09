export type LoginResponse = {
  accessToken: string
  refreshToken: string
}

export type ApiError<T> = {
  response: {
    data: T
  }
}

export type DataError = {
  message: string
  errorCodes: Record<string, string>[]
}
