import type { User } from '@/models/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const user = ref<User|null>(null)

  return { user }
})
