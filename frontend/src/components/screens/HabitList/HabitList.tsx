import {Table, TableCell, TableContainer, TableHead, TableRow, TableBody} from '@mui/material'
import _ from 'lodash'
import {ReactElement} from 'react'
import {useHabits} from '../../../hooks/habits'
import {useAppSelector} from '../../../redux/store'
import {getHabitIntervalEnumText} from '../../../utils/enums'

import style from './HabitList.module.css'

const Groups = (): ReactElement => {
  useHabits()
  const habits = useAppSelector((state) => state.habits)
  return (
    <div className={style['list']}>
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

export default Groups
