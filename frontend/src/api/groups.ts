import {CreateGroupResponse, GroupResponse} from '../types/api'
import {Group} from '../types/Groups'
import api from './api'

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get<GroupResponse>('/v1/groups')
  return response.data.groups
}

export const createGroup = async (name: string, description?: string): Promise<string> => {
  const response = await api.post<CreateGroupResponse>('/v1/groups/create', {name, description})
  return response.data.groupID
}
