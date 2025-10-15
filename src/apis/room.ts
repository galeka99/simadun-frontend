import Api from '@/apis/api'

const RoomApi = {
  list: async function (page?: number, limit?: number) {
    const result = await Api.get(`/v1/room?limit=${limit ?? 25}&page=${page ?? 1}`, true)

    return result.data
  },
}

export default RoomApi
