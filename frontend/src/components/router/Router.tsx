import {ReactElement} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from '../screens/Login/Login'
import Unauthorized from '../screens/Unauthorized/Unauthorized'

type UnauthorizedOrChildrenProps = {
  children: ReactElement
}

const UnauthorizedOrChildren = ({children}: UnauthorizedOrChildrenProps) =>
  localStorage.getItem('refreshToken') ? children : <Unauthorized />

const Router = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UnauthorizedOrChildren children={<div>a</div>} />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
)

export default Router
