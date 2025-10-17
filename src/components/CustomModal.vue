<script setup lang="ts">
const props = defineProps([
  'title',
])
const emit = defineEmits([
  'closed',
])
</script>

<template>
  <div @click="$emit('closed')" class="flex flex-col justify-center items-center p-5 fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[3]">
    <div @click="(e) => e.stopPropagation()" class="flex flex-col bg-white w-full max-h-screen overflow-y-auto sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 rounded-lg p-5">
      <div class="flex flex-row justify-between">
        <span class="text-lg font-bold">{{ title ?? 'Modal' }}</span>
        <button @click="$emit('closed')" class="btn btn-error p-1 rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="divider mt-3 mb-4"></div>
      <slot></slot>
    </div>
  </div>
</template>
