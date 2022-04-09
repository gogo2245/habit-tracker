import {LoginResponse} from '../types/api'
import api from './api'

export const login = async (email: string, password: string, skipReload?: boolean): Promise<void> => {
  const response = await api.post<LoginResponse>('/v1/auth/login', {email, password})
  localStorage.setItem('accessToken', response.data.accessToken)
  localStorage.setItem('refreshToken', response.data.refreshToken)
  !skipReload && location.reload()
}

export const register = async (email: string, username: string, password: string): Promise<void> => {
  await api.post('/v1/auth/register', {email, password, username})
}

export const logout = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  location.reload()
}
