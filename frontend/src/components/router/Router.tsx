import {ReactElement} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Groups from '../screens/Groups/Groups'
import Menu from '../Menu/Menu'
import Login from '../screens/Login/Login'
import Register from '../screens/Register/Register'
import GroupDetail from '../screens/GroupDetail/GroupDetail'
import NewGroup from '../screens/NewGroup/NewGroup'
import CreateHabit from '../screens/CreateHabit/CreateHabit'
import HabitList from '../screens/HabitList/HabitList'

type LoginOrChildrenProps = {
  children: ReactElement
}

const LoginOrChildren = ({children}: LoginOrChildrenProps) =>
  localStorage.getItem('refreshToken') ? children : <Login />

const Router = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LoginOrChildren children={<Menu />} />}>
        <Route index element={<Groups />} />
        <Route path="groups/new" element={<NewGroup />} />
        <Route path="groups/:groupID" element={<GroupDetail />} />
        <Route path="groups/:groupID/update" element={<NewGroup />} />
        <Route path="groups/:groupID/habit/create" element={<CreateHabit />} />
        <Route path="habits" element={<HabitList />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default Router
