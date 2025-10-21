<script setup lang="ts">
const props = defineProps(['label'])
const model = defineModel<boolean>()
</script>

<template>
  <label class="inline-flex items-center cursor-pointer">
    <input type="checkbox" value="" class="sr-only peer" :checked="model">
    <div class="relative w-9 h-5 bg-gray-200 outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
    <span class="ms-3 text-sm font-medium text-gray-600">{{ props.label ?? 'Toggle me' }}</span>
  </label>
</template>
