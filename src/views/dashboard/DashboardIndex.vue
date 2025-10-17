<script setup lang="ts">
import Role from '@/enums/role'
import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue'
import { RouterView, RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const app = useAppStore()
const menus = ref([
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: 'home',
  },
  {
    title: 'Ubah Kata Sandi',
    to: '/dashboard/update-password',
    icon: 'lock_person',
  },
  {
    title: 'Keluar',
    to: '/logout',
    icon: 'logout',
  },
])

onMounted(() => {
  if (app.user?.role === Role.ADMIN) {
    menus.value.splice(1, 0, ...[{
      title: 'Ruangan',
      to: '/dashboard/room',
      icon: 'door_open',
    },
    {
      title: 'User',
      to: '/dashboard/user',
      icon: 'groups',
    }])
  }
})

function menuClass(to: string) {
  const currentRoute = router.currentRoute.value.path

  if (to === currentRoute) {
    return 'flex flex-row items-center bg-indigo-500 font-semibold text-white rounded-lg transition-all py-3 px-5'
  } else {
    return 'flex flex-row items-center hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all py-3 px-5'
  }
}
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-indigo-50 overflow-hidden">
    <nav class="flex flex-row bg-indigo-500 text-white w-full h-14 py-2 px-5">
      <img src="@/assets/images/kota_semarang.png" alt="logo kota semarang" class="h-10 w-auto" />
      <span class="ms-3 text-2xl font-bold self-center">SiMaDun</span>
    </nav>
    <div class="flex flex-row h-full">
      <div class="hidden md:flex flex-col w-4/12 lg:w-3/12 xl:w-2/12 h-full bg-white shadow-lg">
        <div class="flex flex-row bg-gray-200 w-full shadow p-3">
          <div class="flex justify-center items-center bg-white rounded-full w-10 h-10">
            <span class="material-symbols-outlined">person</span>
          </div>
          <div class="flex flex-col ms-3">
            <span class="text-xs text-indigo-600 mb-1">Selamat datang</span>
            <span class="text-sm">{{ app.user?.name ?? 'User' }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-3 p-3 text-gray-600">
          <router-link v-for="(menu, i) in menus" :key="`menu-${i}`" :to="menu.to" :class="menuClass(menu.to)">
            <span class="material-symbols-outlined">{{ menu.icon }}</span>
            <span class="ms-2">{{ menu.title }}</span>
          </router-link>
        </div>
      </div>
      <main class="flex flex-col flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
