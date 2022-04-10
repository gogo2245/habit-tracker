import {CreateHabitResponse} from '../types/api'
import {HabitInterval} from '../types/habits'
import api from './api'

export const createHabit = async (
  groupID: string,
  name: string,
  repetition: number,
  interval: HabitInterval,
  description?: string,
): Promise<string> => {
  const response = await api.post<CreateHabitResponse>(`/v1/groups/${groupID}/habits/add`, {
    name,
    description,
    repetition,
    interval,
  })
  return response.data.habitID
}
