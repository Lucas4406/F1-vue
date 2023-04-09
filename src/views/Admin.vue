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

  <div class="wrapper-profile">
    <profile-card
      v-for="profile in profiles"
      :key="profile.id"
      :profileInfo="profile"
      @refresh-data="updateData"
    />
  </div>
</template>

<script setup>
import { ref, inject } from "vue"
import { makeRequest } from "../functions/makeRequest"
import ProfileCard from "../components/ProfileCard.vue"
const store = inject("store")
const isAdmin = ref(false)
const profiles = ref([])
if (store.user.profileId === import.meta.env.VITE_ADMIN_UID) {
  isAdmin.value = true
}

await getData()
async function updateData() {
  await getData()
}

async function getData() {
  const data = await makeRequest(`${import.meta.env.VITE_API_LINK}/profile`)
  profiles.value = data
}
</script>

<style lang="scss" scoped>
.wrapper-profile {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 20px;
}
</style>
