import {Tab, Tabs} from '@mui/material'
import {ReactElement} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'

import {logout} from '../../api/auth'

const Menu = (): ReactElement => {
  const navigate = useNavigate()
  return (
    <div>
      <Tabs value="0">
        <Tab label="Skupiny" value="0" onClick={() => navigate('/')} />
        <Tab label="Moje aktivity" value="1" onClick={() => navigate('/activity')} />
        <Tab label="Odhlásenie" value="2" onClick={() => logout()} />
      </Tabs>
      <Outlet />
    </div>
  )
}

export default Menu
