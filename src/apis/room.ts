import Api from '@/apis/api'

interface CreateRoomParam {
  name: string
  isPublic: boolean
  unitId: number
}

interface UpdateRoomParam {
  id: number
  name: string
  isPublic: boolean
  unitId: number
}

const RoomApi = {
  all: async function () {
    const result = await Api.get('/v1/room/all', true)

    return result.data
  },

  list: async function (page?: number, limit?: number) {
    const result = await Api.get(`/v1/room?limit=${limit ?? 25}&page=${page ?? 1}`, true)

    return result.data
  },

  detail: async function (id: number) {
    const result = await Api.get(`/v1/room/${id}`, true)

    return result.data
  },

  create: async function (data: CreateRoomParam) {
    const result = await Api.post('/v1/room', data, true)

    return result.data
  },

  update: async function (data: UpdateRoomParam) {
    const result = await Api.put('/v1/room', data, true)

    return result.data
  },

  delete: async function (id: number) {
    await Api.delete(`/v1/room/${id}`, true)

    return true
  },
}

export default RoomApi
