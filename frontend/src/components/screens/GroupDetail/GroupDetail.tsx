import _ from 'lodash'
import {ReactElement} from 'react'
import {useParams} from 'react-router-dom'
import {useGetGroups} from '../../../hooks/groups'
import {useAppSelector} from '../../../redux/store'
import UserList from './UsersList'

import style from './GroupDetail.module.css'
import ControlPanel from './ControlPanel'

const GroupDetail = (): ReactElement => {
  useGetGroups()
  const {groupID} = useParams()
  const group = useAppSelector((state) => _.find(state.groups, (group) => group.id === groupID))
  if (!group) return <div>404</div>
  return (
    <div className={style['wrapper']}>
      <label>Meno skupiny:</label>
      <p>{group.name}</p>
      {group.description && (
        <>
          <label>Stručný popis:</label>
          <p>{group.description}</p>
        </>
      )}
      <ControlPanel role={group.role} />
      <UserList />
    </div>
  )
}

export default GroupDetail
