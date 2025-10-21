<script setup lang="ts">
import RoomApi from '@/apis/room'
import Toast from '@/helpers/toast'
import type { Room } from '@/models/room'
import type { CalendarOptions, DatesSetArg, EventClickArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import CustomButton from '@/components/CustomButton.vue'
import CustomModal from '@/components/CustomModal.vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import type { Agenda } from '@/models/agenda'
import AgendaApi from '@/apis/agenda'
import { useAppStore } from '@/stores/app'
import Role from '@/enums/role'
import Swal from 'sweetalert2'

const app = useAppStore()
const calendarOptions = ref<CalendarOptions>({
  locale: 'id',
  initialDate: moment().toDate(),
  initialView: 'dayGridMonth',
  nowIndicator: true,
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
  ],
  headerToolbar: {
    left: 'dayGridMonth,dayGridWeek,timeGrid,list',
    center: 'title',
    right: 'prev,today,next',
  },
  buttonText: {
    month: 'Bulanan',
    week: 'Mingguan',
    timeGrid: 'Harian',
    list: 'Agenda',
    today: 'Hari Ini',
  },
  datesSet: onDatesSet,
  eventClick: onClickEvent,
  eventClassNames: 'cursor-pointer',
  events: []
})
const startDate = ref<string>(moment().format('YYYY-MM-DD'))
const endDate = ref<string>(moment().format('YYYY-MM-DD'))

const rooms = ref<Room[]>([])
const roomId = ref(0)
const agendas = ref<Agenda[]>([])
const agenda = ref<{
  id: number | null
  roomId: number
  date: string
  startHour: number
  endHour: number
  description: string
  participantTotal: number
  contactName: string | null
  contactPhone: string | null
  paid: boolean
  user: {
    id: number
    name: string
  }
}>({
  id: null,
  roomId: 0,
  date: moment().format('YYYY-MM-DD'),
  startHour: 8,
  endHour: 12,
  description: '',
  participantTotal: 0,
  contactName: null,
  contactPhone: null,
  paid: true,
  user: {
    id: 0,
    name: '',
  }
})
const showAddModal = ref(false)
const showDetailModal = ref(false)
const loading = ref(false)

async function getRooms() {
  try {
    const response = await RoomApi.all()
    rooms.value = response
  } catch (e) {
    Toast.error('Gagal mengambil data ruangan')
  }
}

function onClickEvent(arg: EventClickArg) {
  const id = parseInt(arg.event.id)
  const foundAgenda = agendas.value.find(el => el.id === id)
  if (!foundAgenda) {
    return Toast.error('Agenda tidak ditemukan')
  }

  agenda.value = {
    id: foundAgenda.id,
    date: moment(foundAgenda.date).format('YYYY-MM-DD'),
    startHour: foundAgenda.startHour,
    endHour: foundAgenda.endHour,
    description: foundAgenda.description,
    participantTotal: foundAgenda.participantTotal,
    contactName: foundAgenda.contactName,
    contactPhone: foundAgenda.contactPhone,
    paid: foundAgenda.paid,
    roomId: foundAgenda.roomId,
    user: foundAgenda.user,
  }
  showDetailModal.value = true
}

function onDatesSet(arg: DatesSetArg) {
  startDate.value = moment(arg.start).format('YYYY-MM-DD')
  endDate.value = moment(arg.end).subtract(1, 'day').format('YYYY-MM-DD')

  getAgendas()
}

async function getAgendas() {
  if (!roomId.value || roomId.value === 0) return

  const response = await AgendaApi.list({
    roomId: roomId.value,
    startDate: startDate.value,
    endDate: endDate.value,
  })

  agendas.value = response

  // Reformat agenda to calendar event
  calendarOptions.value.events = response.map(agenda => {
    return {
      id: agenda.id.toString(),
      date: moment(agenda.date).format('YYYY-MM-DD'),
      title: agenda.description,
      start: moment(agenda.date).startOf('day').add(agenda.startHour, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      end: moment(agenda.date).startOf('day').add(agenda.endHour, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    }
  })
}

function newAgenda() {
  agenda.value = {
    id: null,
    roomId: 0,
    date: moment().format('YYYY-MM-DD'),
    startHour: 8,
    endHour: 12,
    description: '',
    participantTotal: 0,
    contactName: null,
    contactPhone: null,
    paid: true,
    user: {
      id: 0,
      name: '',
    }
  }
  showDetailModal.value = false
  showAddModal.value = false
}

async function createAgenda() {
  if (agenda.value.description.trim().length === 0) {
    return Toast.error('Deskripsi kegiatan harus diisi')
  }
  if (agenda.value.participantTotal < 0) {
    return Toast.error('Jumlah peserta minimal 1 orang')
  }
  if (agenda.value.roomId === 0) {
    return Toast.error('Ruangan belum dipilih')
  }

  try {
    loading.value = true

    await AgendaApi.create({
      date: agenda.value.date,
      startHour: agenda.value.startHour,
      endHour: agenda.value.endHour,
      description: agenda.value.description,
      participantTotal: agenda.value.participantTotal,
      contactName: agenda.value.contactName,
      contactPhone: agenda.value.contactPhone,
      paid: agenda.value.paid,
      roomId: agenda.value.roomId,
    })

    await getAgendas()
    agenda.value = {
      id: null,
      roomId: 0,
      date: moment().format('YYYY-MM-DD'),
      startHour: 8,
      endHour: 12,
      description: '',
      participantTotal: 0,
      contactName: null,
      contactPhone: null,
      paid: true,
      user: {
        id: 0,
        name: '',
      }
    }
    Toast.success('Berhasil membuat agenda')
    showAddModal.value = false
    showDetailModal.value = false
  } catch (e) {
    console.error(`ERROR CREATE AGENDA: ${e}`)
  } finally {
    loading.value = false
  }
}

function editAgenda() {
  showDetailModal.value = false
  showAddModal.value = true
}

async function updateAgenda() {
  if (agenda.value.description.trim().length === 0) {
    return Toast.error('Deskripsi kegiatan harus diisi')
  }
  if (agenda.value.participantTotal < 0) {
    return Toast.error('Jumlah peserta minimal 1 orang')
  }
  if (agenda.value.roomId === 0) {
    return Toast.error('Ruangan belum dipilih')
  }

  try {
    loading.value = true

    await AgendaApi.update({
      agendaId: agenda.value.id!,
      date: agenda.value.date,
      startHour: agenda.value.startHour,
      endHour: agenda.value.endHour,
      description: agenda.value.description,
      participantTotal: agenda.value.participantTotal,
      contactName: agenda.value.contactName,
      contactPhone: agenda.value.contactPhone,
      paid: agenda.value.paid,
      roomId: agenda.value.roomId,
    })

    await getAgendas()
    agenda.value = {
      id: null,
      roomId: 0,
      date: moment().format('YYYY-MM-DD'),
      startHour: 8,
      endHour: 12,
      description: '',
      participantTotal: 0,
      contactName: null,
      contactPhone: null,
      paid: true,
      user: {
        id: 0,
        name: '',
      }
    }
    Toast.success('Berhasil memperbarui agenda')
    showAddModal.value = false
    showDetailModal.value = false
  } catch (e) {
    console.error(`ERROR UPDATE AGENDA: ${e}`)
  } finally {
    loading.value = false
  }
}

async function deleteAgenda() {
  if ((agenda.value.id ?? 0) === 0) return

  const result = await Swal.fire({
    text: `Anda yakin akan menghapus agenda '${agenda.value.description}' ?`,
    showConfirmButton: true,
    confirmButtonText: 'Yakin',
    confirmButtonColor: 'oklch(50.5% 0.213 27.518)',
    showCancelButton: true,
    cancelButtonText: 'Batal',
    cancelButtonColor: 'oklch(55.1% 0.027 264.364)',
  })
  if (!result.isConfirmed) return

  try {
    loading.value = true

    await AgendaApi.delete(agenda.value.id!)

    await getAgendas()
    agenda.value = {
      id: null,
      roomId: 0,
      date: moment().format('YYYY-MM-DD'),
      startHour: 8,
      endHour: 12,
      description: '',
      participantTotal: 0,
      contactName: null,
      contactPhone: null,
      paid: true,
      user: {
        id: 0,
        name: '',
      }
    }
    Toast.success('Berhasil menghapus agenda')
    showAddModal.value = false
    showDetailModal.value = false
  } catch (e) {
    console.error(`ERROR DELETE AGENDA: ${e}`)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getRooms()
})
</script>

<template>
  <div class="flex flex-col gap-y-5 py-5 mb-15">
    <div class="flex flex-col md:flex-row bg-white rounded-lg shadow-lg mx-5 p-5 gap-5">
      <div class="flex flex-col w-full md:flex-row md:w-1/2 md:items-center gap-3">
        <label for="room" class="w-full md:w-4/12">Ruangan</label>
        <select id="room" class="form-select w-full md:w-8/12" v-model="roomId" @change="getAgendas">
          <option :value=0 disabled>- Pilih Satu -</option>
          <option v-for="(el, i) in rooms" :key="`room-${i}`" :value="el.id">{{ app.user?.role === Role.ADMIN ?
            `${el.name} - ${el.unit.name}` : el.name }}</option>
        </select>
      </div>
      <div class="flex flex-col md:flex-row md:w-1/2 md:items-center md:justify-end gap-3">
        <custom-button @click="newAgenda" type="success" text="Tambah Agenda Baru" class="w-full md:w-auto" />
      </div>
    </div>
    <div class="flex flex-col bg-white rounded-lg shadow-lg mx-5 p-5">
      <full-calendar :options="calendarOptions" />
    </div>
    <custom-modal v-if="showDetailModal" title="Detail Agenda" @closed="showDetailModal = false">
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Tanggal</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">{{ moment(agenda.date).format('DD MMM yyyy')
        }}</span>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Waktu</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">
          {{ agenda.startHour.toString().padStart(2, '0') }}:00 - {{ agenda.endHour.toString().padStart(2, '0') }}:00
        </span>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Deskripsi Kegiatan</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">{{ agenda.description }}</span>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Jumlah Peserta</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">{{ agenda.participantTotal }} orang</span>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Nama Kontak</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">{{ agenda.contactName }}</span>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Nomor HP Kontak</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">{{ agenda.contactPhone }}</span>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <span class="text-sm text-gray-500 w-full md:w-4/12">Operator</span>
        <span class="text-gray-800 font-semibold w-full md:w-8/12">{{ agenda.user.name }}</span>
      </div>
      <div v-if="agenda.user.id === app.user?.id" class="flex flex-col md:flex-row gap-3 mt-3">
        <custom-button @click="editAgenda" type="primary" text="Ubah Agenda" class="w-full md:w-1/2" />
        <custom-button @click="deleteAgenda" :loading="loading" type="error" text="Hapus Agenda"
          class="w-full md:w-1/2" />
      </div>
    </custom-modal>
    <custom-modal v-if="showAddModal" :title="agenda.id ? 'Perbarui Agenda' : 'Tambah Agenda'"
      @closed="showAddModal = false">
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="selectRoom" class="w-full md:w-4/12">Ruangan</label>
        <select id="selectRoom" class="w-full md:w-8/12 form-select" v-model="agenda.roomId">
          <option :value="0" disabled>- Pilih Satu -</option>
          <option v-for="(room, i) in rooms" :key="`select-room-${i}`" :value="room.id">{{ app.user?.role === Role.ADMIN
            ? `${room.name} - ${room.unit.name}` : room.name }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="date" class="w-full md:w-4/12">Tanggal</label>
        <input id="date" type="date" class="form-input w-full md:w-8/12" v-model="agenda.date">
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label class="w-full md:w-4/12">Waktu</label>
        <div class="flex flex-row w-full md:w-8/12 gap-x-3">
          <select class="form-select w-1/2" v-model="agenda.startHour">
            <option v-for="i in 24" :key="`start-hour-${i}`" :value="i">{{ `${i.toString().padStart(2, '0')}:00` }}
            </option>
          </select>
          <select class="form-select w-1/2" v-model="agenda.endHour">
            <option v-for="i in 24" :key="`end-hour-${i}`" :value="i">{{ `${i.toString().padStart(2, '0')}:00` }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="description" class="w-full md:w-4/12">Deskripsi Kegiatan</label>
        <input id="description" type="text" class="form-input w-full md:w-8/12" v-model="agenda.description">
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="participant" class="w-full md:w-4/12">Jumlah Peserta</label>
        <input id="participant" type="number" class="form-input w-full md:w-8/12" min="0"
          v-model="agenda.participantTotal">
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="contactName" class="w-full md:w-4/12">Nama Kontak</label>
        <input id="contactName" type="text" class="form-input w-full md:w-8/12" v-model="agenda.contactName">
      </div>
      <div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-3 w-full mb-3">
        <label for="contactPhone" class="w-full md:w-4/12">Nomor HP Kontak</label>
        <input id="contactPhone" type="text" class="form-input w-full md:w-8/12" v-model="agenda.contactPhone">
      </div>
      <custom-button v-if="!agenda.id" type="success" text="Tambah Agenda Baru" :loading="loading"
        @click="createAgenda" />
      <custom-button v-if="agenda.id" type="primary" text="Perbarui Agenda" :loading="loading" @click="updateAgenda" />
    </custom-modal>

  </div>
</template>
