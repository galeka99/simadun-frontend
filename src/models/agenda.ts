import type { Room } from '@/models/room'

export interface Agenda {
  id: number
  date: string
  startHour: number
  endHour: number
  description: string
  participantTotal: number
  contactName: string
  contactPhone: string
  paid: boolean
  roomId: number
  userId: number
  createdAt: string
  updatedAt: string

  user: {
    id: number
    name: string
  }
  room: Room
}
