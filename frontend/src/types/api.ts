import {Group} from './Groups'

export type LoginResponse = {
  accessToken: string
  refreshToken: string
}

export type GroupResponse = {
  groups: Group[]
  message: string
}

export type CreateGroupResponse = {
  message: string
  groupID: string
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
