import _ from 'lodash'
import {ReactElement} from 'react'
import CheckIcon from '@mui/icons-material/Check'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {useNavigate} from 'react-router-dom'
import {Group, GroupRoles} from '../../../types/Groups'
import {acceptInvitation, leaveGroup} from '../../../api/groups'

import style from './GroupItem.module.css'

export type GroupItemProps = {
  group: Group
  setForceReload: (func: (val: boolean) => boolean) => void
}

const GroupItem = ({group, setForceReload}: GroupItemProps): ReactElement => {
  const navigate = useNavigate()
  const onAccept = async () => {
    await acceptInvitation(group.id)
    navigate(`/groups/${group.id}`)
  }
  const onDelete = async () => {
    await leaveGroup(group.id)
    setForceReload((val) => !val)
  }
  return (
    <div
      className={`${style['group-item']} ${group.role !== GroupRoles.invited ? style['group-item-clickable'] : ''}`}
      onClick={() => (group.role !== GroupRoles.invited ? navigate(`/groups/${group.id}`) : _.noop())}
    >
      <div className={style['group-heading']}>{group.name}</div>
      {group.role === GroupRoles.invited ? (
        <div>
          <CheckIcon onClick={onAccept} className={style['clickable-icon']} style={{color: 'green'}} />
          <DeleteOutlineIcon onClick={onDelete} className={style['clickable-icon']} style={{color: 'red'}} />
        </div>
      ) : (
        <div className={style['group-description']}>{group.description}</div>
      )}
    </div>
  )
}

export default GroupItem
