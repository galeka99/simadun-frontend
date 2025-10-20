<script setup lang="ts">
import UnitApi from '@/apis/unit'
import Toast from '@/helpers/toast'
import type { PaginateResult } from '@/models/paginate'
import type { Unit } from '@/models/unit'
import { onMounted, ref } from 'vue'
import CustomModal from '@/components/CustomModal.vue'
import CustomInput from '@/components/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'
import Swal from 'sweetalert2'
import type { User } from '@/models/user'
import Role from '@/enums/role'
import UserApi from '@/apis/user'

const datas = ref<PaginateResult<User>>({
  data: [],
  page: 1,
  perPage: 0,
  total: 0,
  totalPages: 0,
})
const units = ref<Unit[]>([])
const showModal = ref(false)
const user = ref<{
  id: number | null
  name: string
  username: string
  password: string,
  confirmPassword: string,
  role: Role
  unitId: number | null
}>({
  id: null,
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: Role.USER,
  unitId: null,
})
const loading = ref(false)

async function getUnits() {
  try {
    const response = await UnitApi.all()
    units.value = response
  } catch (e) {
    Toast.error('Gagal mengambil data unit')
  }
}

async function getDatas(page?: number) {
  try {
    const response = await UserApi.list(page ?? 1)
    datas.value = response
  } catch (e) {
    Toast.error('Gagal mengambil data user')
  }
}

function prevPage() {
  getDatas(datas.value.page--)
}

function nextPage() {
  getDatas(datas.value.page++)
}

function showAddModal() {
  user.value = {
    id: null,
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: Role.USER,
    unitId: null,
  }

  showModal.value = true
}

function showEditModal(data: User) {
  user.value = {
    id: data.id,
    name: data.name,
    username: data.username,
    password: '',
    confirmPassword: '',
    role: data.role,
    unitId: data.unitId,
  }

  showModal.value = true
}

async function addData() {
  if (user.value.name.trim().length === 0) {
    return Toast.error('Nama lengkap harus diisi')
  }
  if (user.value.username.trim().length === 0) {
    return Toast.error('Username harus diisi')
  }
  if (user.value.password.length < 8) {
    return Toast.error('Kata sandi minimal 8 karakter')
  }
  if (user.value.password !== user.value.confirmPassword) {
    return Toast.error('Konfirmasi kata sandi tidak cocok')
  }
  if (!user.value.unitId) {
    return Toast.error('Unit harus dipilih')
  }

  try {
    loading.value = true

    await UserApi.create({
      name: user.value.name,
      username: user.value.username,
      password: user.value.password,
      confirmPassword: user.value.confirmPassword,
      role: user.value.role,
      unitId: user.value.unitId,
    })

    user.value = {
      id: null,
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: Role.USER,
      unitId: null,
    }

    showModal.value = false
    getDatas(1)
    Toast.success('Berhasil menambahkan user baru')
  } catch (e) {
    console.error(`ERROR ADD USER: ${e}`)
  } finally {
    loading.value = false
  }
}

async function updateData() {
  if (user.value.name.trim().length === 0) {
    return Toast.error('Nama lengkap harus diisi')
  }
  if (user.value.username.trim().length === 0) {
    return Toast.error('Username harus diisi')
  }
  if (user.value.password.trim().length > 0) {
    if (user.value.password.length < 8) {
      return Toast.error('Kata sandi minimal 8 karakter')
    }
    if (user.value.password !== user.value.confirmPassword) {
      return Toast.error('Konfirmasi kata sandi tidak cocok')
    }
  }
  if (!user.value.unitId) {
    return Toast.error('Unit harus dipilih')
  }

  try {
    loading.value = true

    const sentData: any = {
      id: user.value.id,
      name: user.value.name,
      username: user.value.username,
      role: user.value.role,
      unitId: user.value.unitId,
    }

    if (user.value.password.trim().length > 0) {
      sentData.password = user.value.password
      sentData.confirmPassword = user.value.confirmPassword
    }

    await UserApi.update(sentData)

    user.value = {
      id: null,
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: Role.USER,
      unitId: null,
    }

    showModal.value = false
    getDatas(1)
    Toast.success('Berhasil memperbarui user')
  } catch (e) {
    console.error(`ERROR UPDATE USER: ${e}`)
  } finally {
    loading.value = false
  }
}

async function deleteData(data: User) {
  const result = await Swal.fire({
    text: `Anda yakin akan menghapus user  ${data.name} (${data.username}) ?`,
    showConfirmButton: true,
    confirmButtonText: 'Yakin',
    confirmButtonColor: 'oklch(50.5% 0.213 27.518)',
    showCancelButton: true,
    cancelButtonText: 'Batal',
    cancelButtonColor: 'oklch(55.1% 0.027 264.364)',
  })

  if (!result.isConfirmed) return

  await UserApi.delete(data.id)
  Toast.success('Berhasil menghapus user')
  getDatas(1)
}

onMounted(() => {
  getUnits()
  getDatas()
})
</script>

<template>
  <div class="flex flex-col bg-white rounded-lg shadow-lg m-5 p-5">
    <span class="text-xl font-bold text-gray-700">User</span>
    <div class="divider my-3"></div>
    <div class="flex flex-row justify-end mb-3">
      <button @click="showAddModal" class="btn btn-success gap-x-3">
        <span>Tambah User Baru</span>
      </button>
    </div>
    <div class="flex w-full overflow-x-auto mb-5">
      <table class="table text-center w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Lengkap</th>
            <th>Username</th>
            <th>Role</th>
            <th>Unit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(el, i) in datas.data" :key="`user-${i}`">
            <td>{{ (datas.page - 1) * datas.perPage + i + 1 }}</td>
            <td>{{ el.name }}</td>
            <td>{{ el.username }}</td>
            <td>
              <span v-if="el.role === Role.ADMIN" class="bg-blue-600 text-white text-xs uppercase font-bold py-1 px-2 rounded">Admin</span>
              <span v-if="el.role === Role.USER" class="bg-purple-600 text-white text-xs uppercase font-bold py-1 px-2 rounded">User</span>
            </td>
            <td>{{ el.unit?.name ?? '-' }}</td>
            <td class="flex flex-col md:flex-row md:justify-center gap-1">
              <button @click="showEditModal(el)" class="btn btn-warning text-xs">Ubah</button>
              <button @click="deleteData(el)" class="btn btn-error text-xs">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col items-center gap-y-3 md:flex-row md:gap-x-3 md:justify-end md:items-center">
      <div class="flex flex-col justify-end text-xs text-gray-500">
        <span>Menampilkan <strong class="text-indigo-500">{{ datas.data.length }}</strong> dari total <strong class="text-indigo-500">{{ datas.total }}</strong> item</span>
        <span>Halaman <strong class="text-indigo-500">{{ datas.page }}</strong> dari total <strong class="text-indigo-500">{{ datas.totalPages }}</strong> halaman</span>
      </div>
      <div class="flex flex-col w-full md:w-auto md:flex-row">
        <button v-if="datas.page > 1" @click="prevPage" class="btn btn-primary rounded-t-lg rounded-b-none md:rounded-l-lg md:rounded-r-none gap-x-3">
          <span class="material-symbols-outlined">chevron_left</span>
          <span>Sebelumnya</span>
        </button>
        <button v-if="datas.page < datas.totalPages" @click="nextPage" class="btn btn-primary rounded-t-none rounded-b-lg md:rounded-l-none md:rounded-r-lg gap-x-3">
          <span>Selanjutnya</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
    <custom-modal v-if="showModal" :title="user.id ? 'Perbarui User' : 'Tambah User Baru'" @closed="showModal = false">
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="unitId" class="w-full md:w-4/12">Unit</label>
        <select id="unitId" class="w-full md:w-8/12 form-select" v-model="user.unitId">
          <option v-for="(unit, i) in units" :key="`unit-${i}`" :value="unit.id">{{ unit.name }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="name" class="w-full md:w-4/12">Nama Lengkap</label>
        <custom-input v-model="user.name" type="text" id="name" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="username" class="w-full md:w-4/12">Username</label>
        <custom-input v-model="user.username" type="text" id="username" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="password" class="w-full md:w-4/12">Kata Sandi</label>
        <custom-input v-model="user.password" type="password" id="password" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="confirmPassword" class="w-full md:w-4/12">Konfirmasi Kata Sandi</label>
        <custom-input v-model="user.confirmPassword" type="password" id="confirmPassword" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-5">
        <label for="userRole" class="w-full md:w-4/12">Role</label>
        <select id="userRole" class="w-full md:w-8/12 form-select" v-model="user.role">
          <option :value="Role.ADMIN">Admin</option>
          <option :value="Role.USER">User</option>
        </select>
      </div>
      <custom-button v-if="!user.id" text="Tambah Baru" type="success" @click="addData" :loading="loading" />
      <custom-button v-if="user.id" text="Perbarui" type="primary" @click="updateData" :loading="loading" />
    </custom-modal>
  </div>
</template>
