import {LoginResponse} from '../types/api'
import api from './api'

export const login = async (email: string, password: string): Promise<void> => {
  const response = await api.post<LoginResponse>('/v1/auth/login', {email, password})
  localStorage.setItem('accessToken', response.accessToken)
  localStorage.setItem('refreshToken', response.refreshToken)
}
