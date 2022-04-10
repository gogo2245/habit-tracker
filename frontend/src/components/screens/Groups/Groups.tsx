import _ from 'lodash'
import {ReactElement, useState} from 'react'
import {useGetGroups} from '../../../hooks/groups'
import {useAppSelector} from '../../../redux/store'
import GroupItem from './GroupItem'

import style from './Groups.module.css'
import NewGroupItem from './NewGroupItem'

const Groups = (): ReactElement => {
  const [forceReload, setForceReload] = useState(false)
  useGetGroups(forceReload)
  const groups = useAppSelector((state) => _.sortBy(state.groups, (group) => [group.role !== 0, group.name]))
  return (
    <div className={style['list']}>
      {_.map(groups, (group) => (
        <GroupItem setForceReload={setForceReload} key={group.id} group={group} />
      ))}
      <NewGroupItem />
    </div>
  )
}

export default Groups
