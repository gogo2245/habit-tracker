export enum GroupRoles {
  invited = 0,
  member = 1,
  habitManager,
  owner,
}

export type Group = {
  id: string
  name: string
  description?: string
  role: GroupRoles
}

export type User = {
  username: string
  id: string
  email: string
  role: GroupRoles
}
