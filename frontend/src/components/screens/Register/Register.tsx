import {Button} from '@mui/material'
import {ReactElement, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {login, register} from '../../../api/auth'
import {DataError} from '../../../types/api'
import {isApiError, simplifyErrors} from '../../../utils/errors'
import {onInputChange} from '../../../utils/inputs'
import TextFieldWithErrors from '../../TextFieldWithErrors/TextFieldWithErrors'

import styles from './Register.module.css'

const Login = (): ReactElement => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [usernameErrors, setUsernameErrors] = useState<string | undefined>()

  const [email, setEmail] = useState<string>('')
  const [emailErrors, setEmailErrors] = useState<string | undefined>()

  const [password, setPassword] = useState<string>('')
  const [passwordErrors, setPasswordErrors] = useState<string | undefined>()

  const [generalError, setGeneralError] = useState<string | undefined>()
  const onRegisterClick = async () => {
    try {
      await register(email, username, password)
      await login(email, password, true)
      navigate('/')
    } catch (e) {
      if (isApiError<DataError>(e)) {
        const data = e.response.data
        const errors = simplifyErrors(data.errorCodes)
        setEmailErrors(errors.email)
        setPasswordErrors(errors.password)
        setUsernameErrors(errors.username)
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
          value={username}
          errors={usernameErrors}
          variant="outlined"
          placeholder="Meno"
          type="text"
          error={!!generalError}
          onChange={onInputChange(setUsername)}
        />
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
        <Button onClick={onRegisterClick}>Registrovať sa</Button>
        <Button onClick={() => navigate('/')}>Prihlásiť sa</Button>
      </div>
    </div>
  )
}

export default Login
