import type { Unit } from '@/models/unit'

export interface Room {
  id: number
  name: string
  isPublic: boolean
  unitId: number
  unit: Unit
  createdAt: string
  updatedAt: string
}
