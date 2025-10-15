enum Role {
  ADMIN = 1,
  USER = 2,
}

export interface User {
  id: number
  name: string
  username: string
  role: Role
  unitId: number
  createdAt: string
  updatedAt: string
  unit?: {
    id: number
    name: string
  }
}
