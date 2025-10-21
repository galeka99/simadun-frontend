<script setup lang="ts">
import RoomApi from '@/apis/room'
import UnitApi from '@/apis/unit'
import Toast from '@/helpers/toast'
import type { Room } from '@/models/room'
import type { Unit } from '@/models/unit'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { CalendarOptions, DatesSetArg, EventContentArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import moment from 'moment'
import AgendaApi from '@/apis/agenda'

const units = ref<Unit[]>([])
const unitId = ref(0)
const rooms = ref<Room[]>([])
const roomId = ref(0)

const startDate = ref(moment().format('YYYY-MM-DD'))
const endDate = ref(moment().format('YYYY-MM-DD'))
const calendarOptions = ref<CalendarOptions>({
  locale: 'id',
  initialDate: moment().toDate(),
  initialView: 'dayGridMonth',
  nowIndicator: true,
  plugins: [
    dayGridPlugin,
  ],
  headerToolbar: {
    right: 'prev,today,next',
  },
  buttonText: {
    month: 'Bulanan',
    week: 'Mingguan',
    timeGrid: 'Harian',
    list: 'Agenda',
    today: 'Hari Ini',
  },
  datesSet: (arg: DatesSetArg) => {
    startDate.value = moment(arg.start).format('YYYY-MM-DD')
    endDate.value = moment(arg.end).subtract(1, 'day').format('YYYY-MM-DD')

    getDatas()
  },
  eventClassNames: [
    'flex',
    'flex-col',
    'items-center',
    'font-bold',
    'bg-red-500',
    'text-white',
  ],
  eventContent: (arg: EventContentArg) => {
    const startTime = moment(arg.event.start).format('HH:mm')
    const endTime = moment(arg.event.end).format('HH:mm')

    return `${startTime} - ${endTime}`
  },
  events: []
})

async function onChangeUnit() {
  await getRooms()
  roomId.value = 0

  await getDatas()
}

async function getUnits() {
  try {
    units.value = await UnitApi.all()
  } catch (e) {
    Toast.error('Gagal mengambil data unit')
  }
}

async function onChangeRoom() {
  await getDatas()
}

async function getRooms() {
  if (unitId.value === 0) return

  try {
    roomId.value = 0
    rooms.value = await RoomApi.public(unitId.value)
  } catch (e) {
    Toast.error('Gagal mengambil data ruangan')
  }
}

async function getDatas() {
  if (unitId.value === 0) return
  if (roomId.value === 0) return

  try {
    const agendas = await AgendaApi.public({
      roomId: roomId.value,
      startDate: startDate.value,
      endDate: endDate.value,
    })

    calendarOptions.value.events = agendas.map(agenda => {
      return {
        id: agenda.id.toString(),
        date: moment(agenda.date).format('YYYY-MM-DD'),
        title: 'Slot Terisi',
        start: moment(agenda.date).startOf('day').add(agenda.startHour, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        end: moment(agenda.date).startOf('day').add(agenda.endHour, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      }
    })
  } catch (e) {
    Toast.error('Gagal mengambil data agenda')
  }
}

onMounted(() => {
  getUnits()
})
</script>

<template>
  <div class="flex flex-col items-center w-screen min-h-screen bg-indigo-50 pt-12">
    <nav class="flex flex-row justify-center bg-indigo-500 text-white w-full fixed top-0 z-[99] h-12">
      <div class="flex flex-row justify-between w-full max-w-[1200px] h-full">
        <div class="flex flex-row items-center py-2 px-5">
          <img src="@/assets/images/kota_semarang.png" alt="logo kota semarang" class="h-8 w-auto" />
          <span class="ms-3 text-lg font-bold self-center">SiMaDun</span>
        </div>
        <router-link to="/login" class="btn btn-primary rounded-none">
          <span>Masuk</span>
          <span class="material-symbols-outlined ms-3">chevron_right</span>
        </router-link>
      </div>
    </nav>
    <main class="flex flex-col items-center bg-white w-full max-w-[1200px] min-h-screen shadow-lg p-5">
      <div class="flex flex-col md:flex-row w-full gap-y-3 gap-x-5">
        <div class="flex flex-col w-full md:flex-row md:w-1/2 md:items-center gap-2">
          <label for="unit" class="w-full md:w-3/12">Unit</label>
          <select id="unit" v-model="unitId" class="form-select w-full md:w-9/12" @change="onChangeUnit">
            <option :value="0" disabled>- Pilih Satu -</option>
            <option v-for="(el, i) in units" :key="`unit-${i}`" :value="el.id">{{ el.name }}</option>
          </select>
        </div>
        <div class="flex flex-col w-full md:flex-row md:w-1/2 md:items-center gap-2">
          <label for="room" class="w-full md:w-3/12">Ruangan</label>
          <select id="room" v-model="roomId" class="form-select w-full md:w-9/12" @change="onChangeRoom">
            <option :value="0" disabled>- Pilih Satu -</option>
            <option v-for="(el, i) in rooms" :key="`room-${i}`" :value="el.id">{{ el.name }}</option>
          </select>
        </div>
      </div>
      <div class="divider my-5"></div>
      <div class="flex flex-col w-full">
        <full-calendar :options="calendarOptions" />
      </div>
    </main>
  </div>
</template>
