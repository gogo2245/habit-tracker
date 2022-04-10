import {useEffect} from 'react'
import {getGroupHabits, getHabits} from '../api/habits'
import {setGroupHabits} from '../redux/groupHabits'
import {setHabits} from '../redux/habits'
import {useAppDispatch} from '../redux/store'

export const useGroupHabits = (groupID: string): void => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const func = async () => {
      const habits = await getGroupHabits(groupID)
      dispatch(setGroupHabits({habits, groupID}))
    }
    func()
  }, [dispatch, groupID])
}

export const useHabits = (): void => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const func = async () => {
      const habits = await getHabits()
      dispatch(setHabits(habits))
    }
    func()
  }, [dispatch])
}
