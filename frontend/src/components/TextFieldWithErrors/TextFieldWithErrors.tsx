import {TextFieldProps, TextField} from '@mui/material'
import {ReactElement} from 'react'
import {translateError} from '../../utils/errors'

import style from './TextFieldWithErrors.module.css'

const TextFieldWithErrors = (props: TextFieldProps & {errors?: string}): ReactElement => {
  return (
    <div className={style['input-wrapper']}>
      <TextField {...props} error={props.error || !!props.errors} />
      {props.errors && <div className={style['error-text']}>{translateError(props.errors)}</div>}
    </div>
  )
}

export default TextFieldWithErrors
