<template>
  <div
    class="flex flex-row gap-4 w-screen justify-center items-center h-screen"
    v-if="isAdmin"
  >
    <button class="text-xl items-center justify-center mt-6">
      <router-link to="/test">Introducere echipe</router-link>
    </button>
    <button class="text-xl items-center justify-center mt-6">
      <router-link to="/updateteams">Editare echipe</router-link>
    </button>
    <div class="flex flex-row gap-2">
      <button class="text-xl items-center justify-center mt-6">
        <a
          :href=clasament_piloti_link
          target="_blank"
          >Update clasament piloti</a
        >
      </button>
      <button class="text-xl items-center justify-center mt-6">
        <a :href=echipe_link
          >Update clasament echipe</a
        >
      </button>
      <button class="text-xl items-center justify-center mt-6">
        <a
          :href=stiri_translate_link
          target="_blank"
          >Update 6 stiri</a
        >
      </button>
      <button @click="counter.increment" class="text-xl items-center justify-center mt-6">Adaugă 1 la curse</button>
      <button @click="counter.decrease" class="text-xl items-center justify-center mt-6">Scade 1 la curse</button>
    </div>
    <p>Numărul curent este: {{ counter.count }}</p>
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
import { useCounterStore } from '../stores.js'
const counter = useCounterStore()
import { getAuth } from "firebase/auth"
import axios from "axios"
const store = inject("store")
const isAdmin = ref(false)
const profiles = ref([])
const clasament_piloti_link = `${import.meta.env.VITE_API_LINK}/clasament-piloti`
const echipe_link = `${import.meta.env.VITE_API_LINK}/echipe`
const stiri_translate_link = `${import.meta.env.VITE_API_LINK}/stiri-translate`
if (store.user.profileId === import.meta.env.VITE_ADMIN_UID) {
  isAdmin.value = true
}

await getData()
async function updateData() {
  await getData()
}

async function getData() {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    alert("Nu ești autentificat")
    return
  }

  const token = await user.getIdToken()

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_LINK}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    profiles.value = response.data
  } catch (error) {
    console.error(error)
    alert("Eroare la preluarea datelor: " + error.message)
  }
}
</script>

<style lang="scss" scoped>
.wrapper-profile {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 20px;
}
</style>
