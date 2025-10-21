import type { Unit } from '@/models/unit'
import Api from '@/apis/api'

const UnitApi = {
  all: async function (): Promise<Unit[]> {
    const response = await Api.get('/v1/unit/all')

    return response.data
  },
}

export default UnitApi
