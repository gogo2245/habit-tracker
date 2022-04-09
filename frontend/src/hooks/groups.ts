import {useEffect} from 'react'
import {getGroups} from '../api/groups'
import {setGroups} from '../redux/groups'
import {useAppDispatch} from '../redux/store'

export const useGetGroups = (): void => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const func = async () => {
      const groups = await getGroups()
      dispatch(setGroups(groups))
    }
    func()
  }, [dispatch])
}
