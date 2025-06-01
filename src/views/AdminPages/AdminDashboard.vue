<template>
  <div
      class="flex flex-col gap-6 w-full justify-center items-center min-h-screen p-6 bg-gray-50"
      v-if="isAdmin"
  >
    <div class="flex flex-wrap justify-center gap-4">
      <router-link
          to="/test"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Introducere echipe
      </router-link>

      <router-link
          to="/update-teams"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Editare echipe cu id
      </router-link>

      <a
          :href="clasament_piloti_link"
          target="_blank"
          class="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
      >
        Update clasament piloți
      </a>

      <a
          :href="echipe_link"
          class="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
      >
        Update clasament echipe
      </a>

      <a
          :href="stiri_translate_link"
          target="_blank"
          class="px-6 py-3 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition"
      >
        Update 6 știri
      </a>

      <button
          class="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition cursor-pointer"
      >
        <router-link to="/admin/season-events" class="text-inherit no-underline hover:no-underline">
          Evenimente sezon
        </router-link>
      </button>
      <button
          class="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition cursor-pointer"
      >
        <router-link to="/admin/driver-editor" class="text-inherit no-underline hover:no-underline">
          Editare piloti
        </router-link>
      </button>
    </div>
  </div>

  <div class="wrapper-profile mt-8">
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
import ProfileCard from "../../components/ProfileCard.vue"
import { useCounterStore } from '@/stores.js'
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
