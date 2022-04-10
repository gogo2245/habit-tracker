import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Habit} from '../types/habits'

export const groupHabitsSlice = createSlice({
  name: 'groupHabits',
  initialState: {} as Record<string, Habit[]>,
  reducers: {
    setGroupHabits: (state, action: PayloadAction<{groupID: string; habits: Habit[]}>) =>
      (state = {...state, [action.payload.groupID]: action.payload.habits}),
  },
})

export const {setGroupHabits} = groupHabitsSlice.actions

export default groupHabitsSlice.reducer
