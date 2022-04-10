import {CreateGroupResponse, GroupResponse, UserResponse} from '../types/api'
import {Group, User} from '../types/Groups'
import api from './api'

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get<GroupResponse>('/v1/groups')
  return response.data.groups
}

export const createGroup = async (name: string, description?: string): Promise<string> => {
  const response = await api.post<CreateGroupResponse>('/v1/groups/create', {name, description})
  return response.data.groupID
}

export const deleteGroup = async (groupID: string): Promise<void> => {
  await api.delete<CreateGroupResponse>(`/v1/groups/${groupID}`)
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateGroup = async (groupID: string, name: string, description?: string): Promise<void> => {
  await api.put(`/v1/groups/${groupID}`, {name, description})
}

export const getGroupUsers = async (groupID: string): Promise<User[]> => {
  const response = await api.get<UserResponse>(`/v1/groups/${groupID}/users`)
  return response.data.users
}

export const inviteUser = async (groupID: string, email: string): Promise<void> => {
  await api.post(`/v1/groups/invite`, {groupID, email})
}

export const acceptInvitation = async (groupID: string): Promise<void> => {
  await api.post(`/v1/groups/${groupID}/invite/accept`)
}

export const leaveGroup = async (groupID: string): Promise<void> => {
  await api.post(`/v1/groups/${groupID}/leave`)
}
