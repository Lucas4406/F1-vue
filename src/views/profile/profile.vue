<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col">
    <!-- Profile-box -->
    <div
        class="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16"
    >
      <div class="px-6">
        <div class="flex flex-wrap justify-center">
          <div class="w-full flex justify-center">
            <div class="relative">
              <img
                  :src="store.user.profilePhoto"
                  class="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 w-[150px] h-[150px] object-cover"
                  :alt="`Poza de profil ${store.user.displayName}`"
              />
            </div>
          </div>
          <div class="w-full text-center mt-20">
            <div class="flex justify-center lg:pt-4 pt-8 pb-0">
              <div class="p-3 text-center">
                <span
                    class="text-xl font-bold block uppercase tracking-wide text-slate-700"
                >{{ store.user.lastName }}</span
                >
                <span class="text-sm text-slate-400">Last Name</span>
              </div>
              <div class="p-3 text-center">
                <span
                    class="text-xl font-bold block uppercase tracking-wide text-slate-700"
                >{{ store.user.firstName }}</span
                >
                <span class="text-sm text-slate-400">First Name</span>
              </div>

              <div class="p-3 text-center">
                <span
                    class="text-xl font-bold block uppercase tracking-wide text-slate-700"
                >{{ store.user.country }}</span
                >
                <span class="text-sm text-slate-400">Country</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-2">
          <h3 class="text-2xl text-slate-700 font-bold leading-normal mb-1">
            {{ store.user.displayName }}
          </h3>
          <div class="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
            <i class="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i
            >{{ store.user.email }}
          </div>
        </div>
        <div class="mt-6 py-6 border-t border-slate-200 text-center">
          <div class="flex flex-wrap justify-center">
            <div class="w-full px-4 gap-4 flex justify-center">
              <a
                  @click="logout"
                  class="font-normal text-slate-700 hover:text-slate-400 cursor-pointer"
              >Log Out</a
              >
              <router-link
                  to="/update-profile"
                  class="font-normal text-slate-700 hover:text-slate-400 cursor-pointer"
              >Update Profile</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        class="text-xl flex flex-row gap-2 items-center justify-center"
        v-if="showSelect"
    >
      <div alt="echipa" class="flex flex-row gap-2 items-center justify-center">
        <label class="text-label" for="echipaPref">Favourite team:</label>
        <select
            id="echipaPref"
            name="echipa"
            class="selectie"
            v-model="echipaPref"
        >
          <option
              :value="echipa"
              class="optiune"
              v-for="echipa in echipeArray"
              :key="echipa.id"
          >
            {{ echipa }}
          </option>
        </select>
      </div>
      <div class="flex flex-row gap-2 items-center justify-center">
        <label class="text-label" for="soferPref">Favourite driver:</label>
        <select
            id="soferPref"
            name="pilot"
            class="selectie"
            v-model="soferPref"
        >
          <option
              :value="sofer"
              class="optiune"
              v-for="sofer in soferiArray"
              :key="sofer.id"
          >
            {{ sofer }}
          </option>
        </select>
        <button
            type="submit"
            @click="updateDb"
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
    <div class="flex flex-row h-[20rem] items-center justify-center my-6 gap-4">
      <ConstructorCard
          v-if="hasFavTeam"
          :team="favTeamData"
          :darkMode="darkMode"
          class="sm:w-[20rem]"
      />
      <PilotCard
          v-if="hasFavDriver"
          :pilot="favDriverData"
          :darkMode="darkMode"
          class="sm:w-[25rem]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"
import axios from "axios"

import ConstructorCard from "@/components/ConstructorCard.vue"
import PilotCard from "@/components/PilotCard.vue"
import { makeRequest } from "@/functions/makeRequest"
import { authRequest } from "@/functions/authRequest"

const router = useRouter()
const auth = getAuth()
const user = auth.currentUser
const store = inject("store")

const echipaPref = ref(store.user.favTeam)
const soferPref = ref(store.user.favDriver)

const echipeArray = ref([])
const soferiArray = ref([])

const favTeamData = ref(null)
const favDriverData = ref(null)

const hasFavTeam = ref(false)
const hasFavDriver = ref(false)
const showSelect = ref(false)

const darkMode = ref(false)

const logout = () => {
  signOut(auth).then(() => window.location.replace("/"))
}

const getAllTeams = async () => {
  const data = await makeRequest(`${import.meta.env.VITE_API_LINK}/mongo/teams/all`)
  echipeArray.value = data.map(t => t.name)
  return data
}

const getAllDrivers = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_LINK}/mongo/piloti?order=asc`)
  soferiArray.value = data.map(item => `${item.primulNume} ${item.alDoileaNume}`)
}

const loadFavTeam = async () => {
  if (!echipaPref.value || echipaPref.value.length < 2) return

  const teams = await getAllTeams()
  const shortName = echipaPref.value?.substring(0, 4)
  const { data } = await axios.get("https://api.jolpi.ca/ergast/f1/current/constructorstandings.json")
  const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings

  const teamData = teams.find(t => t.name.includes(shortName))
  if (teamData) {
    favTeamData.value = standings.find(s => s.Constructor.name.includes(shortName))
    hasFavTeam.value = !!favTeamData.value
  }
}

const loadFavDriver = async () => {
  if (!soferPref.value || soferPref.value.length < 2) return

  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_LINK}/mongo/piloti/${soferPref.value}`)
    if (data?.[0]) {
      favDriverData.value = data[0]
      hasFavDriver.value = true
    }
  } catch (error) {
    console.warn("Driver not found or invalid:", soferPref.value)
  }
}

const updateDb = async () => {
  const urlProfile = `${import.meta.env.VITE_API_LINK}/profile/change/team/${user.uid}`
  const urlFans = `${import.meta.env.VITE_API_LINK}/mongo/piloti/update-fans`

  try {
    // Salvezi preferințele în profil
    await authRequest("POST", urlProfile, {
      favTeam: echipaPref.value || null,
      favDriver: soferPref.value || null
    })

    // Actualizezi store local
    const oldDriver = store.user.favDriver
    store.user.favTeam = echipaPref.value
    store.user.favDriver = soferPref.value

    // Apelezi API-ul care updatează nr_fani pentru piloți
    await authRequest("POST" , urlFans, {
      newDriver: soferPref.value,
      oldDriver: oldDriver
    })

    // Reîncarci datele pentru a reflecta schimbările
    await Promise.all([loadFavTeam(), loadFavDriver()])
  } catch (err) {
    console.error("Failed to update profile:", err)
  }
}


onMounted(async () => {
  document.title = `Profile - ${store.user.displayName}`
  router.push({ query: { user: store.user.displayName } })

  await Promise.all([getAllDrivers(), getAllTeams()])
  showSelect.value = true

  if (store.user.favTeam && store.user.favTeam.length > 1) {
    echipaPref.value = store.user.favTeam
    await loadFavTeam()
  }

  if (store.user.favDriver && store.user.favDriver.length > 1) {
    soferPref.value = store.user.favDriver
    await loadFavDriver()
  }
})
</script>

<style scoped>
@import "../../assets/formSelect-curse.css";
</style>
