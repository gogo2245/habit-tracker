import {CreateHabitResponse, HabitResponse} from '../types/api'
import {Habit, HabitInterval} from '../types/habits'
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

export const getGroupHabits = async (groupID: string): Promise<Habit[]> => {
  const response = await api.get<HabitResponse>(`/v1/groups/${groupID}/habits`)
  return response.data.habits
}
