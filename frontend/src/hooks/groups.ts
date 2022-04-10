import {useEffect} from 'react'
import {getGroups, getGroupUsers} from '../api/groups'
import {setGroups} from '../redux/groups'
import {setGroupUsers} from '../redux/groupUsers'
import {useAppDispatch} from '../redux/store'

export const useGetGroups = (forceReload?: unknown): void => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const func = async () => {
      const groups = await getGroups()
      dispatch(setGroups(groups))
    }
    func()
  }, [dispatch, forceReload])
}

export const useGroupUsers = (groupID: string): void => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const func = async () => {
      const users = await getGroupUsers(groupID)
      dispatch(setGroupUsers({users, groupID}))
    }
    func()
  }, [dispatch, groupID])
}
