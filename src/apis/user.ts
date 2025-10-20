import Api from '@/apis/api'

interface CreateUserParam {
  name: string
  username: string
  password: string
  confirmPassword: string
  role: number
  unitId: number
}

interface UpdateUserParam {
  id: string
  name: string
  username: string
  password?: string
  confirmPassword?: string
  role: number
  unitId: number
}

const UserApi = {
  list: async function (page?: number, limit?: number) {
    const result = await Api.get(`/v1/user?limit=${limit ?? 25}&page=${page ?? 1}`, true)

    return result.data
  },

  detail: async function (id: number) {
    const result = await Api.get(`/v1/user/${id}`, true)

    return result.data
  },

  create: async function (data: CreateUserParam) {
    const result = await Api.post('/v1/user', data, true)

    return result.data
  },

  update: async function (data: UpdateUserParam) {
    const result = await Api.put('/v1/user', data, true)

    return result.data
  },

  delete: async function (id: number) {
    await Api.delete(`/v1/user/${id}`, true)

    return true
  },
}

export default UserApi
