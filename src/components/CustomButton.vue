<script setup lang="ts">
import CustomSpinner from '@/components/CustomSpinner.vue'

const props = defineProps([
  'type',
  'text',
  'loading',
])
const emits = defineEmits([
  'click'
])
</script>

<template>
  <button :class="`btn btn-${props.type ?? 'primary'}`" @click="emits('click')">
    <span v-if="!(props.loading ?? false)">
      {{ props.text ?? 'Custom Button' }}
    </span>
    <CustomSpinner v-if="(props.loading ?? false)" />
  </button>
</template>
