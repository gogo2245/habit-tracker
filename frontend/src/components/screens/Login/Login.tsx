import {Button} from '@mui/material'
import {ReactElement, useState} from 'react'
import {login} from '../../../api/auth'
import {DataError} from '../../../types/api'
import {isApiError, simplifyErrors} from '../../../utils/errors'
import {onInputChange} from '../../../utils/inputs'
import TextFieldWithErrors from '../../TextFieldWithErrors/TextFieldWithErrors'

import styles from './Login.module.css'

const Login = (): ReactElement => {
  const [email, setEmail] = useState<string>('')
  const [emailErrors, setEmailErrors] = useState<string | undefined>()

  const [password, setPassword] = useState<string>('')
  const [passwordErrors, setPasswordErrors] = useState<string | undefined>()

  const [generalError, setGeneralError] = useState<string | undefined>()
  const onLoginClick = async () => {
    try {
      await login(email, password)
    } catch (e) {
      if (isApiError<DataError>(e)) {
        const data = e.response.data
        const errors = simplifyErrors(data.errorCodes)
        setEmailErrors(errors.email)
        setPasswordErrors(errors.password)
        console.log(generalError, emailErrors, passwordErrors)
        if (data.message === 'CredentialsNotCorrect') setGeneralError('Prihlasovacie údaje nie sú správne')
        else if (!data.errorCodes) setGeneralError('Niečo nie je v poriadku. Skúste prosím neskôr.')
        else setGeneralError(undefined)
      }
    }
  }
  return (
    <div className={styles['login-wrapper']}>
      <div className={styles.login}>
        {<div className={styles['error-text']}>{generalError || ''}</div>}
        <TextFieldWithErrors
          value={email}
          errors={emailErrors}
          variant="outlined"
          placeholder="Email"
          type="text"
          error={!!generalError}
          onChange={onInputChange(setEmail)}
        />
        <TextFieldWithErrors
          value={password}
          errors={passwordErrors}
          variant="outlined"
          placeholder="Heslo"
          type="password"
          error={!!generalError}
          onChange={onInputChange(setPassword)}
        />
        <Button onClick={onLoginClick}>Prihlásiť sa</Button>
        <Button>Registrovať sa</Button>
      </div>
    </div>
  )
}

export default Login
