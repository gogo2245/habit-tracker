import _ from 'lodash'
import {ReactElement} from 'react'
import {useGetGroups} from '../../../hooks/groups'
import {useAppSelector} from '../../../redux/store'
import GroupItem from './GroupItem'

import style from './Groups.module.css'
import NewGroupItem from './NewGroupItem'

const Groups = (): ReactElement => {
  useGetGroups()
  const groups = useAppSelector((state) => state.groups)
  return (
    <div className={style['list']}>
      {_.map(groups, (group) => (
        <GroupItem key={group.id} group={group} />
      ))}
      <NewGroupItem />
    </div>
  )
}

export default Groups
