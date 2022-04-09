import {ReactElement} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Groups from '../screens/Groups/Groups'
import Login from '../screens/Login/Login'

type LoginOrChildrenProps = {
  children: ReactElement
}

const LoginOrChildren = ({children}: LoginOrChildrenProps) =>
  localStorage.getItem('refreshToken') ? children : <Login />

const Router = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginOrChildren children={<Groups />} />} />
    </Routes>
  </BrowserRouter>
)

export default Router
