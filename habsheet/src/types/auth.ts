import {refreshTokenRequestSchema, updatePasswordRequestSchema} from 'src/validation/auth'
import * as yup from 'yup'

export type TokenResponse = {
  refreshToken: string
  accessToken: string
}

export type UpdatePasswordRequest = yup.InferType<typeof updatePasswordRequestSchema>

export type RefreshTokenRequest = yup.InferType<typeof refreshTokenRequestSchema>

export type TokenError = {errorMessage: string}

export type UserInfo = {pk: string}
