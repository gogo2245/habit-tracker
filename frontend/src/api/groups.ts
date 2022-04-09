import _ from 'lodash'
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
export const updateGroup = async (groupID: string, name?: string, description?: string): Promise<void> => {
  _.noop()
}

export const getGroupUsers = async (groupID: string): Promise<User[]> => {
  const response = await api.get<UserResponse>(`/v1/groups/${groupID}/users`)
  return response.data.users
}
