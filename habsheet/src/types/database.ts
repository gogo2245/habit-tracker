export type DatabaseUser = {
  id: string
  email: string
  username: string
  password: string
}

export type DatabaseGroup = {
  id: string
  name: string
  description?: string
}

export enum GroupRole {
  invited = 0,
  member = 1,
  habitManager,
  owner,
}

export type DatabaseGroupUser = {
  groupID: string
  userID: string
  role: GroupRole
}
