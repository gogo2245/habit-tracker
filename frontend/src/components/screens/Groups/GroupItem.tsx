import {ReactElement} from 'react'
import {useNavigate} from 'react-router-dom'
import {Group} from '../../../types/Groups'

import style from './GroupItem.module.css'

export type GroupItemProps = {
  group: Group
}

const GroupItem = ({group}: GroupItemProps): ReactElement => {
  const navigate = useNavigate()
  return (
    <div className={style['group-item']} onClick={() => navigate(`/groups/${group.id}`)}>
      <div className={style['group-heading']}>{group.name}</div>
      <div className={style['group-description']}>{group.description}</div>
    </div>
  )
}

export default GroupItem
