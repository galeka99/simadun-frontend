<script setup lang="ts">
import RoomApi from '@/apis/room'
import UnitApi from '@/apis/unit'
import Toast from '@/helpers/toast'
import type { PaginateResult } from '@/models/paginate'
import type { Room } from '@/models/room'
import type { Unit } from '@/models/unit'
import { onMounted, ref } from 'vue'

const datas = ref<PaginateResult<Room>>({
  data: [],
  page: 1,
  perPage: 0,
  total: 0,
  totalPages: 0,
})
const units = ref<Unit[]>([])
const showModal = ref(false)
const room = ref({
  id: null,
  name: '',
  isPublic: true,
  unitId: null,
})

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
        <span>Tambah User Baru</span>
      </button>
    </div>
    <div class="flex w-full overflow-x-auto mb-5">
      <table class="table text-center w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Ruangan</th>
            <th>Unit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, i) in datas.data" :key="`room-${i}`">
            <td>{{ (datas.page - 1) * datas.perPage + i + 1 }}</td>
            <td>{{ room.name }}</td>
            <td>{{ room.unit.name }}</td>
            <td class="flex flex-col md:flex-row md:justify-center gap-1">
              <button class="btn btn-warning text-xs">Ubah</button>
              <button class="btn btn-error text-xs">Hapus</button>
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
    <div v-if="showModal" @click="showModal = !showModal" class="flex flex-col justify-center items-center p-5 fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[3]">
      <div @click="(e) => e.stopPropagation()" class="flex flex-col bg-white w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 rounded-lg p-5">

      </div>
    </div>
  </div>
</template>
