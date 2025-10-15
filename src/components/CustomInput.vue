<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps([
  'id',
  'type',
  'class',
  'autofocus',
])
const emit = defineEmits([
  'enter'
])
const model = defineModel()
const isPassword = ref(false)
const showPassword = ref(false)

onMounted(() => {
  isPassword.value = (props.type ?? 'text') === 'password'
})
</script>

<template>
  <input v-if="!isPassword" :id="props.id" :type="props.type ?? 'text'" :class="`${props.class} form-input`" :autofocus="props.autofocus" v-model="model" @keyup.enter="$emit('enter', $event)">
  <div v-if="isPassword" :class="`${props.class} relative`">
    <input :id="props.id" :type="showPassword ? 'text' : 'password'" class="form-input w-full" :autofocus="props.autofocus" v-model="model" @keyup.enter="$emit('enter', $event)">
    <button class="absolute inset-y-[8px] right-[10px] cursor-pointer text-gray-500 hover:text-gray-700 outline-none" @click="showPassword = !showPassword">
      <span v-if="showPassword" class="material-symbols-outlined" style="font-size: 16pt;">visibility</span>
      <span v-if="!showPassword" class="material-symbols-outlined" style="font-size: 16pt;">visibility_off</span>
    </button>
  </div>
</template>
