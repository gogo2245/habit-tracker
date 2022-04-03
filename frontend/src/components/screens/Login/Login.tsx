import {ReactElement, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {login} from '../../../api/auth'

const Login = (): ReactElement => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const onLoginClick = async () => {
    await login(email, password)
    navigate('/')
  }
  return (
    <div>
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="text" placeholder="Email" />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        placeholder="Password"
      />
      <button onClick={onLoginClick}>Login</button>
    </div>
  )
}

export default Login
