<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'
import { ref } from 'vue'
import AuthApi from '@/apis/auth'
import { useRouter } from 'vue-router'
import Toast from '@/helpers/toast'

const data = ref({
  username: '',
  password: '',
})
const loading = ref(false)
const router = useRouter()

async function login() {
  try {
    if (data.value.username.length === 0) {
      return Toast.error('Username harus diisi')
    }
    if (data.value.password.length === 0) {
      return Toast.error('Kata sandi harus diisi')
    }

    loading.value = true

    const token = await AuthApi.login(data.value)
    localStorage.setItem('token', token)

    router.push('/dashboard')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex flex-col w-screen min-h-screen justify-center items-center bg-indigo-50 p-5">
    <div class="flex flex-col bg-white border border-gray-300 rounded-md shadow-lg p-5 w-full sm:w-10/12 md:w-8/12 lg:w-5/12 xl:w-4/12">
      <div class="flex flex-col md:flex-row justify-center items-center">
        <img src="@/assets/images/kota_semarang.png" alt="logo kota semarang" class="w-10 h-auto mb-3 md:mb-0">
        <div class="flex flex-col items-center w-full text-center mx-0 md:mx-3">
          <span class="text-lg font-semibold uppercase">Sistem Manajemen Gedung</span>
          <span class="text-sm text-indigo-600">Kecamatan Tembalang Kota Semarang</span>
        </div>
      </div>
      <div class="divider my-5"></div>
      <div class="flex flex-col md:flex-row md:items-center mb-3">
        <label for="username" class="mb-1 md:w-4/12">Username</label>
        <CustomInput id="username" type="text" class="md:w-8/12" v-model="data.username" />
      </div>
      <div class="flex flex-col md:flex-row md:items-center mb-5">
        <label for="password" class="mb-1 md:w-4/12">Kata Sandi</label>
        <CustomInput id="password" type="password" class="md:w-8/12" v-model="data.password" />
      </div>
      <CustomButton text="Masuk" :loading="loading" @click="login" />
    </div>
  </main>
</template>
