import {ReactElement} from 'react'
import {useNavigate} from 'react-router-dom'

import style from './GroupItem.module.css'

const NewGroupItem = (): ReactElement => {
  const navigate = useNavigate()
  return (
    <div className={style['group-item']} onClick={() => navigate('/groups/new')}>
      <div className={style['group-heading']}>Nová skupina</div>
    </div>
  )
}

export default NewGroupItem
