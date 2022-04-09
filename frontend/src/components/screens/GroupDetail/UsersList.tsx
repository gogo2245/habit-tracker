import _ from 'lodash'
import {TableContainer, Table, TableHead, TableCell, TableRow, TableBody} from '@mui/material'
import {ReactElement} from 'react'
import {useParams} from 'react-router-dom'
import {useGroupUsers} from '../../../hooks/groups'
import {useAppSelector} from '../../../redux/store'
import {getRoleEnumText} from '../../../utils/enums'

import style from './GroupDetail.module.css'

const UserList = (): ReactElement => {
  const {groupID} = useParams()
  useGroupUsers(groupID || '')
  const users = useAppSelector((state) => state.groupUsers[groupID || ''] || [])
  if (!users.length) return <div>Loading...</div>
  return (
    <div className={style['user-list-wrapper']}>
      <div>Členovia skupiny</div>
      <TableContainer>
        <Table sx={{minWidth: 400}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Užívateľské meno</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Rola</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(users, (row) => (
              <TableRow key={row.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">{getRoleEnumText(row.role)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
