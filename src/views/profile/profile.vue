<template>
  <div class="w-screen flex justify-center items-center min-h-screen flex-col">
    <!-- Profile-box -->
    <div
        class="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16"
        v-once
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
      <div class="flex flex-row gap-2 items-center justify-center">
        <label class="text-label" for="echipaPref">Favourite team:</label>
        <select
            id="echipaPref"
            name="echipa"
            class="selectie"
            v-model="echipaPref"
        >
          <option
              :value="echipa.teamName"
              class="optiune"
              v-for="echipa in firestoreTeamsArray"
              :key="echipa.teamName"
          >
            {{ echipa.teamName }}
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
              :value="sofer.fullName"
              class="optiune"
              v-for="sofer in fireStoreArray"
              :key="sofer.fullName"
          >
            {{ sofer.fullName }}
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
import { ref, onMounted, inject } from "vue"
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
const fireStoreArray = ref([])
const firestoreTeamsArray = ref([])

const echipeArray = ref([])

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

const loadFirestoreDrivers = async () => {
  try {
    fireStoreArray.value = await makeRequest(`${import.meta.env.VITE_API_LINK}/api-drivers-f/view/favourite`); // [{ fullName, driverKey, mongoDriverId }]
  } catch (err) {
    console.error("Failed to load Firestore drivers:", err);
  }
};

const loadFirestoreTeams = async () => {
  try {
    firestoreTeamsArray.value = await makeRequest(`${import.meta.env.VITE_API_LINK}/api-teams-f/view/favourite`); // [{ fullName, driverKey, mongoDriverId }]
  } catch (err) {
    console.error("Failed to load Firestore teams:", err);
  }
};

const loadFavTeam = async () => {
  if (!echipaPref.value || echipaPref.value.length < 2) return
  try {
    const teams = await getAllTeams()
    if (teams) {
      const teamDetails = teams.find(t => t.name === echipaPref.value)
      if (teamDetails) {
        favTeamData.value = teamDetails
        hasFavTeam.value = true
      } else {
        hasFavTeam.value = false
      }
    }
  } catch (error) {
    console.warn("Team not found or invalid:", echipaPref.value)
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
  const selectedDriverKey = soferPref.value;
  const oldDriverKey = store.user.favDriver;
  const selectedTeam = echipaPref.value;
  const oldTeam = store.user.favTeam;

  const urlProfile = `${import.meta.env.VITE_API_LINK}/profile/change/team/${user.uid}`

  const selectedDriver = fireStoreArray.value.find(d => d.fullName === selectedDriverKey);
  const selectedTeamBun = firestoreTeamsArray.value.find(d => d.teamName === selectedTeam);

  try {
    // Dacă s-a schimbat doar pilotul
    if (selectedDriverKey !== oldDriverKey && selectedDriver) {
      await authRequest("POST", `${import.meta.env.VITE_API_LINK}/favourite/driver`, {
        pilotMongoId: selectedDriver.mongoDriverId,
        pilotFirestoreId: selectedDriver.driverKey
      });
    }

    if (selectedTeam !== oldTeam) {
      await authRequest("POST", `${import.meta.env.VITE_API_LINK}/favourite/team`, {
        echipaMongoId: selectedTeamBun.mongoTeamId,
        echipaFirestoreId: selectedTeamBun.teamKey
      });
    }

    // Dacă s-a schimbat echipa sau pilotul – actualizează profilul
    if (selectedTeam !== oldTeam || selectedDriverKey !== oldDriverKey) {
      await authRequest("POST", urlProfile, {
        favTeam: selectedTeam || null,
        favDriver: selectedDriverKey || null
      });

      // Actualizează local store-ul
      store.user.favTeam = selectedTeam;
      store.user.favDriver = selectedDriverKey;

      if (selectedDriver) await loadFavDriver();
      if (selectedTeam) await loadFavTeam();
    } else {
      console.log("No changes detected.");
    }

  } catch (err) {
    console.error("Failed to update favourites:", err);
  }
};


onMounted(async () => {
  document.title = `Profile - ${store.user.displayName}`;
  router.push({ query: { user: store.user.displayName } });

  await Promise.all([
    loadFirestoreDrivers(),
    loadFirestoreTeams(),// 🔁
  ]);


  // Setează valori din store la select
  const matchedDriver = fireStoreArray.value.find(d => d.fullName === store.user.favDriver);
  if (matchedDriver) {
    soferPref.value = matchedDriver.fullName;
    await loadFavDriver();
  }

  const matchedTeam = firestoreTeamsArray.value.find(d => d.teamName === store.user.favTeam);
  if (matchedTeam) {
    echipaPref.value = matchedTeam.teamName;
    await loadFavTeam();
  }
  showSelect.value = true;


  if (soferPref.value) await loadFavDriver();
  if (echipaPref.value) await loadFavTeam();
});
</script>

<style scoped>
@import "../../assets/formSelect-curse.css";
</style>
