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
          href="https://f1-site-api.vercel.app/stiri-translate"
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
// const proxyUrl = "https://cors-anywhere-xafh.onrender.com/"
// const apiUrl = "https://api.formula1.com/v1/event-tracker"
// const data = await fetchData(apiUrl)
// console.log(data, data.fomRaceId)
//
// const dataRace = await fetchData(apiUrl + `/meeting/${data.fomRaceId}`)
// console.log(dataRace)
//
// const dataRace2 = await fetchData(apiUrl + `/meeting/${Number(data.fomRaceId)+1}`)
// console.log(dataRace2)
//
//
// async function fetchData(url) {
//   try {
//     const response = await axios.get(proxyUrl + url, {
//       headers: {
//         "X-Requested-With": "XMLHttpRequest",
//         Apikey: "qPgPPRJyGCIPxFT3el4MF7thXHyJCzAP",
//         Locale: "en",
//       },
//     })
//
//     // Handle the response data
//     return response.data
//   } catch (error) {
//     // Handle the error
//     return error
//   }
// }
</script>

<style lang="scss" scoped>
.wrapper-profile {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 20px;
}
</style>
