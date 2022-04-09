import _ from 'lodash'
import {Button} from '@mui/material'
import {ReactElement, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {createGroup, updateGroup} from '../../../api/groups'
import {useGetGroups} from '../../../hooks/groups'
import {useAppSelector} from '../../../redux/store'
import {DataError} from '../../../types/api'
import {isApiError, simplifyErrors} from '../../../utils/errors'
import {onInputChange} from '../../../utils/inputs'
import TextFieldWithErrors from '../../TextFieldWithErrors/TextFieldWithErrors'

import styles from './NewGroup.module.css'

const NewGroup = (): ReactElement => {
  const navigate = useNavigate()
  const {groupID} = useParams()
  const group = useAppSelector((state) => _.find(state.groups, (group) => group.id === groupID))
  useGetGroups()
  const [name, setName] = useState<string>('')
  const [nameErrors, setNameErrors] = useState<string | undefined>()

  const [description, setDescription] = useState<string>('')
  const [descriptionErrors, setDescriptionErrors] = useState<string | undefined>()

  const [generalError, setGeneralError] = useState<string | undefined>()

  useEffect(() => {
    group && setName(group.name)
    group && group.description && setDescription(group.description)
  }, [group, setName, setDescription])
  const onLoginClick = async () => {
    try {
      const id = group
        ? await updateGroup(group.id, name, description)
        : await createGroup(name, description || undefined)
      navigate(`/groups/${group?.id || id}`)
    } catch (e) {
      if (isApiError<DataError>(e)) {
        const data = e.response.data
        const errors = simplifyErrors(data.errorCodes)
        setNameErrors(errors.name)
        setDescriptionErrors(errors.description)
        if (!data.errorCodes) setGeneralError('Niečo nie je v poriadku. Skúste prosím neskôr.')
        else setGeneralError(undefined)
      }
    }
  }
  return (
    <div className={styles['new-group-wrapper']}>
      <div className={styles['new-group']}>
        {<div className={styles['error-text']}>{generalError || ''}</div>}
        <TextFieldWithErrors
          value={name}
          errors={nameErrors}
          variant="outlined"
          placeholder="Meno Skupiny"
          type="text"
          error={!!generalError}
          onChange={onInputChange(setName)}
        />
        <TextFieldWithErrors
          value={description}
          errors={descriptionErrors}
          variant="outlined"
          placeholder="Popis Skupiny"
          type="text"
          error={!!generalError}
          onChange={onInputChange(setDescription)}
        />
        <Button onClick={onLoginClick}>{group ? 'Uprav' : 'Vytvor Skupinu'}</Button>
      </div>
    </div>
  )
}

export default NewGroup
