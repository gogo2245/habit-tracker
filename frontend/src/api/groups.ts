import {GroupResponse} from '../types/api'
import {Group} from '../types/Groups'
import api from './api'

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get<GroupResponse>('/v1/groups')
  return response.data.groups
}
