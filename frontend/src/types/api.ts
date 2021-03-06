import {Group, User} from './Groups'
import {Habit} from './habits'

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

export type CreateHabitResponse = {
  message: string
  habitID: string
}

export type HabitResponse = {
  habits: Habit[]
  message: string
}

export type UserResponse = {
  users: User[]
  message: string
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
