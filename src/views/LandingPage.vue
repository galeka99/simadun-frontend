<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col items-center w-screen h-screen bg-indigo-50 overflow-hidden">
    <nav class="flex flex-row justify-center bg-indigo-500 text-white w-full h-12">
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
      <span class="text-xl font-semibold">Jadwal Ketersediaan Gedung</span>
      <div class="divider my-3"></div>
    </main>
  </div>
</template>
