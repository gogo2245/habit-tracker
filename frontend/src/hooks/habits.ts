import {useEffect} from 'react'
import {getGroupHabits} from '../api/habits'
import {setGroupHabits} from '../redux/groupHabits'
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
