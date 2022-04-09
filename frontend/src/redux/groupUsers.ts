import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User} from '../types/Groups'

export const groupUsersSlice = createSlice({
  name: 'groupUsers',
  initialState: {} as Record<string, User[]>,
  reducers: {
    setGroupUsers: (state, action: PayloadAction<{groupID: string; users: User[]}>) =>
      (state = {...state, [action.payload.groupID]: action.payload.users}),
  },
})

export const {setGroupUsers} = groupUsersSlice.actions

export default groupUsersSlice.reducer
