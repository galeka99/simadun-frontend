<script setup lang="ts">
import AuthApi from '@/apis/auth'
import Toast from '@/helpers/toast'
import { ref } from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'

const data = ref({
  password: '',
  newPassword: '',
  confirmPassword: '',
})
const loading = ref(false)

async function updatePassword() {
  if (data.value.password.trim().length === 0) {
    return Toast.error('Kata sandi lama harus diisi')
  }
  if (data.value.newPassword.trim().length === 0) {
    return Toast.error('Kata sandi baru harus diisi')
  }
  if (data.value.confirmPassword.trim().length === 0) {
    return Toast.error('Konfirmasi kata sandi baru harus diisi')
  }

  try {
    loading.value = true
    await AuthApi.updatePassword(data.value)

    Toast.success('Berhasil memperbarui kata sandi')
    data.value = {
      password: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (e) {
    console.error(`ERROR UPDATE PASSWORD: ${e}`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col bg-white rounded-lg shadow-lg m-5 p-5">
    <span class="text-xl font-bold text-gray-700">Ubah Kata Sandi</span>
    <div class="divider my-3"></div>
    <div class="flex flex-col w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 gap-y-3">
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full">
        <label for="password" class="w-full md:w-4/12">Kata Sandi Lama</label>
        <custom-input v-model="data.password" id="password" type="password" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full">
        <label for="newPassword" class="w-full md:w-4/12">Kata Sandi Baru</label>
        <custom-input v-model="data.newPassword" id="newPassword" type="password" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full">
        <label for="confirmPassword" class="w-full md:w-4/12">Konfirmasi Kata Sandi</label>
        <custom-input v-model="data.confirmPassword" id="confirmPassword" type="password" class="w-full md:w-8/12" />
      </div>
      <custom-button text="Simpan" class="self-end" :loading="loading" @click="updatePassword" />
    </div>
  </div>
</template>
