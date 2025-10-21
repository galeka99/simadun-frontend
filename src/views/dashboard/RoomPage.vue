<script setup lang="ts">
import RoomApi from '@/apis/room'
import UnitApi from '@/apis/unit'
import Toast from '@/helpers/toast'
import type { PaginateResult } from '@/models/paginate'
import type { Room } from '@/models/room'
import type { Unit } from '@/models/unit'
import { onMounted, ref } from 'vue'
import CustomModal from '@/components/CustomModal.vue'
import CustomInput from '@/components/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'
import Swal from 'sweetalert2'

const datas = ref<PaginateResult<Room>>({
  data: [],
  page: 1,
  perPage: 0,
  total: 0,
  totalPages: 0,
})
const units = ref<Unit[]>([])
const showModal = ref(false)
const room = ref<{
  id: number | null
  name: string
  isPublic: boolean
  unitId: number | null
}>({
  id: null,
  name: '',
  isPublic: true,
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
    const response = await RoomApi.list(page ?? 1)
    datas.value = response
  } catch (e) {
    Toast.error('Gagal mengambil data ruangan')
  }
}

function prevPage() {
  getDatas(datas.value.page--)
}

function nextPage() {
  getDatas(datas.value.page++)
}

function showAddModal() {
  room.value = {
    id: null,
    name: '',
    isPublic: true,
    unitId: null,
  }

  showModal.value = true
}

function showEditModal(data: Room) {
  room.value = {
    id: data.id,
    name: data.name,
    isPublic: data.isPublic,
    unitId: data.unitId,
  }

  showModal.value = true
}

async function addData() {
  if (room.value.unitId === null || room.value.unitId === 0) {
    return Toast.error('Unit belum dipilih')
  }
  if (room.value.name.length === 0) {
    return Toast.error('Nama ruangan harus diisi')
  }

  try {
    loading.value = true

    await RoomApi.create({
      name: room.value.name,
      isPublic: room.value.isPublic,
      unitId: room.value.unitId,
    })

    room.value = {
      id: null,
      name: '',
      isPublic: true,
      unitId: null,
    }

    showModal.value = false
    getDatas(1)
    Toast.success('Berhasil menambahkan ruangan baru')
  } catch (e) {
    console.error(`ERROR ADD ROOM: ${e}`)
  } finally {
    loading.value = false
  }
}

async function updateData() {
  if (room.value.unitId === null || room.value.unitId === 0) {
    return Toast.error('Unit belum dipilih')
  }
  if (room.value.name.length === 0) {
    return Toast.error('Nama ruangan harus diisi')
  }

  try {
    loading.value = true

    await RoomApi.update({
      id: room.value.id!,
      name: room.value.name,
      isPublic: room.value.isPublic,
      unitId: room.value.unitId,
    })

    room.value = {
      id: null,
      name: '',
      isPublic: true,
      unitId: null,
    }

    showModal.value = false
    getDatas(1)
    Toast.success('Berhasil memperbarui ruangan')
  } catch (e) {
    console.error(`ERROR UPDATE ROOM: ${e}`)
  } finally {
    loading.value = false
  }
}

async function deleteData(data: Room) {
  const result = await Swal.fire({
    text: `Anda yakin akan menghapus ruangan '${data.name}' ?`,
    showConfirmButton: true,
    confirmButtonText: 'Yakin',
    confirmButtonColor: 'oklch(50.5% 0.213 27.518)',
    showCancelButton: true,
    cancelButtonText: 'Batal',
    cancelButtonColor: 'oklch(55.1% 0.027 264.364)',
  })

  if (!result.isConfirmed) return

  await RoomApi.delete(data.id)
  Toast.success('Berhasil menghapus ruangan')
  getDatas(1)
}

onMounted(() => {
  getUnits()
  getDatas()
})
</script>

<template>
  <div class="flex flex-col bg-white rounded-lg shadow-lg m-5 p-5">
    <span class="text-xl font-bold text-gray-700">Ruangan</span>
    <div class="divider my-3"></div>
    <div class="flex flex-row justify-end mb-3">
      <button @click="showAddModal" class="btn btn-success gap-x-3">
        <span>Tambah Ruangan Baru</span>
      </button>
    </div>
    <div class="flex w-full overflow-x-auto mb-5">
      <table class="table text-center w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Ruangan</th>
            <th>Jenis Ruangan</th>
            <th>Unit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, i) in datas.data" :key="`room-${i}`">
            <td>{{ (datas.page - 1) * datas.perPage + i + 1 }}</td>
            <td>{{ room.name }}</td>
            <td>
              <span v-if="room.isPublic" class="bg-green-600 text-white text-xs uppercase font-bold py-1 px-2 rounded">Umum</span>
              <span v-if="!room.isPublic" class="bg-amber-600 text-white text-xs uppercase font-bold py-1 px-2 rounded">Internal</span>
            </td>
            <td>{{ room.unit.name }}</td>
            <td class="flex flex-col md:flex-row md:justify-center gap-1">
              <button @click="showEditModal(room)" class="btn btn-warning text-xs">Ubah</button>
              <button @click="deleteData(room)" class="btn btn-error text-xs">Hapus</button>
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
    <custom-modal v-if="showModal" :title="room.id ? 'Perbarui Ruangan' : 'Tambah Ruangan Baru'" @closed="showModal = false">
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="unitId" class="w-full md:w-4/12">Unit</label>
        <select id="unitId" class="w-full md:w-8/12 form-select" v-model="room.unitId">
          <option v-for="(unit, i) in units" :key="`unit-${i}`" :value="unit.id">{{ unit.name }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="roomName" class="w-full md:w-4/12">Nama Ruangan</label>
        <custom-input v-model="room.name" class="w-full md:w-8/12" />
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-5">
        <div class="w-full md:w-4/12"></div>
        <div class="flex flex-row gap-x-2 w-full md:w-8/12">
          <input id="roomPublic" type="checkbox" v-model="room.isPublic">
          <label for="roomPublic" class="w-full md:w-4/12">Untuk umum</label>
        </div>
      </div>
      <custom-button v-if="!room.id" text="Tambah Baru" type="success" @click="addData" :loading="loading" />
      <custom-button v-if="room.id" text="Perbarui" type="primary" @click="updateData" :loading="loading" />
    </custom-modal>
  </div>
</template>
