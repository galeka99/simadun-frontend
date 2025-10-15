import Api from '@/apis/api'
import type { User } from '@/models/user'

interface LoginParams {
  username: string
  password: string
}

const AuthApi = {
  login: async function (data: LoginParams): Promise<string> {
    const response = await Api.post('/v1/auth/login', data, false)

    return response.data
  },

  info: async function (): Promise<User> {
    const response = await Api.get('/v1/auth', true)

    return response.data as User
  },
}

export default AuthApi
