<template>
  <div
    class="flex flex-row gap-4 w-screen justify-center items-center h-screen"
    v-if="isAdmin"
  >
    <button class="text-xl items-center justify-center mt-6">
      <router-link to="/test">Introducere echipe</router-link>
    </button>
    <div class="flex flex-row gap-2">
      <button class="text-xl items-center justify-center mt-6">
        <a
          href="https://f1-site-api.vercel.app/clasament-piloti"
          target="_blank"
          >Update clasament piloti</a
        >
      </button>
      <button class="text-xl items-center justify-center mt-6">
        <a href="https://f1-site-api.vercel.app/echipe" target="_blank"
          >Update clasament echipe</a
        >
      </button>
      <button class="text-xl items-center justify-center mt-6">
        <a
          href="https://f1-site-api.vercel.app/stiri-translate/6"
          target="_blank"
          >Update 6 stiri</a
        >
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue"
const store = inject("store")
const isAdmin = ref(false)
if (store.user.profileId === import.meta.env.VITE_ADMIN_UID) {
  isAdmin.value = true
}
</script>
