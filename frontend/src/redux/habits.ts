import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Habit} from '../types/habits'

export const habitsSlice = createSlice({
  name: 'habits',
  initialState: [] as Habit[],
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => (state = action.payload),
  },
})

export const {setHabits} = habitsSlice.actions

export default habitsSlice.reducer
