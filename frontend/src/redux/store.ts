import {configureStore} from '@reduxjs/toolkit'
import {useSelector, useDispatch, TypedUseSelectorHook} from 'react-redux'
import groups from './groups'

const store = configureStore({
  reducer: {
    groups,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
