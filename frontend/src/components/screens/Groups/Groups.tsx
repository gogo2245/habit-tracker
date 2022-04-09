import {Tab, Tabs} from '@mui/material'
import {ReactElement} from 'react'

import {logout} from '../../../api/auth'

const Groups = (): ReactElement => {
  return (
    <Tabs value="0">
      <Tab label="Skupiny" value="0" />
      <Tab label="Moje aktivity" value="1" />
      <Tab label="Odhlásenie" value="2" onClick={() => logout()} />
    </Tabs>
  )
}

export default Groups
