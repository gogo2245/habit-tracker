import _ from 'lodash'
import {TableContainer, Table, TableHead, TableCell, TableRow, TableBody} from '@mui/material'
import {ReactElement} from 'react'
import {useParams} from 'react-router-dom'
import {useGroupHabits} from '../../../hooks/habits'
import {useAppSelector} from '../../../redux/store'
import {getHabitIntervalEnumText} from '../../../utils/enums'

import style from './GroupDetail.module.css'

const HabitList = (): ReactElement => {
  const {groupID} = useParams()
  useGroupHabits(groupID || '')
  const habits = useAppSelector((state) => state.groupHabits[groupID || ''] || [])
  if (!habits.length) return <div>Žiadne aktivity</div>
  return (
    <div className={style['user-list-wrapper']}>
      <div>Aktivity</div>
      <TableContainer>
        <Table sx={{minWidth: 400}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Meno</TableCell>
              <TableCell>Popis</TableCell>
              <TableCell>Opakovanie</TableCell>
              <TableCell align="right">Typ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(habits, (row) => (
              <TableRow key={row.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.repetition} krát</TableCell>
                <TableCell align="right">{getHabitIntervalEnumText(row.interval)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default HabitList
