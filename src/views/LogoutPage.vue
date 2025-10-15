<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const app = useAppStore()
const router = useRouter()

onMounted(() => {
  localStorage.clear()

  app.user = null

  router.push({ path: '/login' })
})
</script>

<template>
  <div></div>
</template>
