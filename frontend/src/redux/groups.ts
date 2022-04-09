import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Group} from '../types/Groups'

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: [] as Group[],
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => (state = action.payload),
  },
})

export const {setGroups} = groupsSlice.actions

export default groupsSlice.reducer
