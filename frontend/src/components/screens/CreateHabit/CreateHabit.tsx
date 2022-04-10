import {Button} from '@mui/material'
import {ReactElement, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {createHabit} from '../../../api/habits'
import {DataError} from '../../../types/api'
import {HabitInterval} from '../../../types/habits'
import {isApiError, simplifyErrors} from '../../../utils/errors'
import {onInputChange} from '../../../utils/inputs'
import TextFieldWithErrors from '../../TextFieldWithErrors/TextFieldWithErrors'

import styles from './CreateHabit.module.css'

const CreateHabit = (): ReactElement => {
  const navigate = useNavigate()
  const {groupID} = useParams()
  const [name, setName] = useState('')
  const [nameErrors, setNameErrors] = useState<string | undefined>()

  const [description, setDescription] = useState('')
  const [descriptionErrors, setDescriptionErrors] = useState<string | undefined>()

  const [interval, setInterval] = useState<HabitInterval>(0)
  const [intervalErrors, setIntervalErrors] = useState<string | undefined>()

  const [repetition, setRepetition] = useState<number | ''>('')
  const [repetitionErrors, setRepetitionErrors] = useState<string | undefined>()

  const [generalError, setGeneralError] = useState<string | undefined>()
  const onHabitClick = async () => {
    try {
      await createHabit(groupID || '', name, repetition || 1, interval, description)
      navigate(`/groups/${groupID}`)
    } catch (e) {
      if (isApiError<DataError>(e)) {
        const data = e.response.data
        const errors = simplifyErrors(data.errorCodes)
        setNameErrors(errors.name)
        setDescriptionErrors(errors.description)
        setIntervalErrors(errors.interval)
        setRepetitionErrors(errors.repetition)
        if (!data.errorCodes) setGeneralError('Niečo nie je v poriadku. Skúste prosím neskôr.')
        else setGeneralError(undefined)
      }
    }
  }
  return (
    <div className={styles['habit-wrapper']}>
      <div className={styles.habit}>
        {<div className={styles['error-text']}>{generalError || ''}</div>}
        <TextFieldWithErrors
          value={name}
          errors={nameErrors}
          variant="outlined"
          placeholder="Meno"
          type="text"
          error={!!generalError}
          onChange={onInputChange(setName)}
        />
        <TextFieldWithErrors
          value={description}
          errors={descriptionErrors}
          variant="outlined"
          placeholder="Popis"
          type="text"
          error={!!generalError}
          onChange={onInputChange(setDescription)}
        />
        <TextFieldWithErrors
          value={repetition}
          errors={repetitionErrors}
          variant="outlined"
          placeholder="Opakovanie"
          type="number"
          error={!!generalError}
          onChange={(event) => setRepetition(event.target.value !== '' ? Number(event.target.value) : '')}
        />
        <TextFieldWithErrors
          value={interval}
          select
          errors={intervalErrors}
          variant="outlined"
          error={!!generalError}
          onChange={(event) => setInterval(Number(event.target.value))}
          SelectProps={{
            native: true,
          }}
        >
          <option value={0}>Denne</option>
          <option value={1}>Týždenne</option>
          <option value={2}>Mesačne</option>
        </TextFieldWithErrors>
        <Button onClick={onHabitClick}>Vytvor aktivitu</Button>
      </div>
    </div>
  )
}

export default CreateHabit
