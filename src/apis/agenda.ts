import Api from '@/apis/api'
import type { Agenda } from '@/models/agenda'
import moment from 'moment'

interface AllAgendaParams {
  roomId: number
  startDate: string
  endDate: string
}

interface CreateAgendaBody {
  date: string
  startHour: number
  endHour: number
  description: string
  participantTotal: number
  contactName: string | null
  contactPhone: string | null
  paid: boolean
  roomId: number
}

interface UpdateAgendaBody {
  agendaId: number
  date: string
  startHour: number
  endHour: number
  description: string
  participantTotal: number
  contactName: string | null
  contactPhone: string | null
  paid: boolean
  roomId: number
}

const AgendaApi = {
  public: async function (params: AllAgendaParams): Promise<Agenda[]> {
    const { roomId, startDate, endDate } = params
    const result = await Api.get(
      `/v1/agenda/public?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`,
    )

    return result.data
  },

  list: async function (params: AllAgendaParams): Promise<Agenda[]> {
    const { roomId, startDate, endDate } = params
    const result = await Api.get(
      `/v1/agenda?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`,
      true,
    )

    return result.data
  },

  detail: async function (id: number): Promise<Agenda> {
    const result = await Api.get(`/v1/agenda/${id}`, true)

    return result.data
  },

  create: async function (data: CreateAgendaBody) {
    const result = await Api.post('/v1/agenda', data, true)

    return result.data
  },

  update: async function (data: UpdateAgendaBody) {
    const result = await Api.put('/v1/agenda', data, true)

    return result.data
  },

  delete: async function (id: number) {
    await Api.delete(`/v1/agenda/${id}`, true)

    return true
  },
}

export default AgendaApi
