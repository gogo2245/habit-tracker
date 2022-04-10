import _ from 'lodash'
import axios, {AxiosRequestHeaders} from 'axios'

const REQUEST_TIMEOUT = 15 * 1000

const prefix = process.env.REACT_APP_API_URL

export const apiInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformRequestOptions = (params: Record<string, string | string[]>) => {
  let options = ''
  for (const key in params) {
    if (typeof params[key] !== 'object' && params[key]) {
      options += `${key}=${params[key]}&`
    } else if (typeof params[key] === 'object' && params[key] && params[key].length) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(params[key] as string[]).forEach((el: string) => {
        options += `${key}=${el}&`
      })
    }
  }
  return options ? options.slice(0, -1) : options
}

apiInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken && !config.headers?.Authorization)
    config.headers = {...config.headers, Authorization: `Bearer ${accessToken}`}
  return config
})

const refreshAccessToken = async () => {
  const response = await apiInstance.post(buildPathAndQuery('/v1/auth/refresh'), {
    refreshToken: localStorage.getItem('refreshToken'),
  })
  const refreshToken = response.data.refreshToken
  const accessToken = response.data.accessToken
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

apiInstance.interceptors.response.use(_.identity, async (error) => {
  const originalRequest = error.config
  if (originalRequest._retry) {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
  }
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const accessToken = await refreshAccessToken()
    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
    return apiInstance(originalRequest)
  }
  return Promise.reject(error)
})

export const buildPathAndQuery = (path: string, query?: unknown): string =>
  axios.getUri({url: prefix + path, params: query, paramsSerializer: (params) => transformRequestOptions(params)})

type Options = {
  query?: unknown
  headers?: AxiosRequestHeaders
  params?: Record<string, string | string[]>
}

const api = {
  get: <T>(path: string, options: Options = {}): Promise<{data: T}> =>
    apiInstance.get(buildPathAndQuery(path, options.query), {
      headers: options.headers || {},
      params: options.params || {},
    }),
  post: <T>(path: string, data?: unknown, options: Options = {}): Promise<{data: T}> =>
    apiInstance.post(buildPathAndQuery(path, options.query), data, {
      headers: options.headers || {},
    }),
  delete: <T>(path: string, options: Options = {}): Promise<{data: T}> =>
    apiInstance.delete(buildPathAndQuery(path, options.query), {
      headers: options.headers || {},
    }),
  put: <T>(path: string, data?: unknown, options: Options = {}): Promise<{data: T}> =>
    apiInstance.put(buildPathAndQuery(path, options.query), data, {
      headers: options.headers || {},
    }),
  // TODO add other methods
}

export default api
