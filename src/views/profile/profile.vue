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
                class="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
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
      <div alt="sofer" class="flex flex-row gap-2 items-center justify-center">
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
        v-if="bla"
        :team="favArr"
        :darkMode="darkMode"
        class="sm:w-[20rem]"
      />
      <PilotCard
        v-if="driverOk"
        :pilot="favDriv"
        :darkMode="darkMode"
        class="sm:w-[25rem]"
      />
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { getAuth, signOut } from "firebase/auth"
import { ref, onMounted, inject } from "vue"
import { useRouter } from "vue-router"
import ConstructorCard from "../../components/ConstructorCard.vue"
import PilotCard from "../../components/PilotCard.vue"
import { makeRequest } from "../../functions/makeRequest"
const auth = getAuth()
const user = auth.currentUser
const router = useRouter()
const store = inject("store")
const echipaPref = ref(store.user.favTeam)
const soferPref = ref(store.user.favDriver)
const echipaPrefdata = ref("")
const soferPrefdata = ref("")
const echipeArray = ref([])
const soferiArray = ref([])
const darkMode = ref(false)
const isAdmin = ref(false)
const showSelect = ref(false)
const bla = ref(false)
const driverOk = ref(false)
const favArr = ref([])
const favDriv = ref([])
const fontSize = ref("3rem")
const currentEnc = JSON.parse(localStorage.getItem("currentUser"))
if (store.user.profileId === import.meta.env.VITE_ADMIN_UID) {
  isAdmin.value = true
}
function logout() {
  signOut(auth).then(() => {
    window.location.replace("/")
  })
}
async function getDataFull() {
  const resp = await makeRequest(
    `${import.meta.env.VITE_API_LINK}/mongo/teams/all`
  )
  let teams = []
  for (var i = 0; i < resp.length; i++) {
    teams[i] = resp[i].name
    echipeArray.value[i] = teams[i]
  }
}
async function getAllDrivers() {
  const date = await axios.get(`${import.meta.env.VITE_API_LINK}/mongo/piloti?order=asc`)
  soferiArray.value = date.data.map(item => `${item.primulNume} ${item.alDoileaNume}`)
}
async function favoriteTeam() {
  const fav = store.user.favTeam.substring(0, 4)
  const resp = await axios(
    "https://api.jolpi.ca/ergast/f1/current/constructorstandings.json"
  )
  const echipe = resp.data
  const arr =
    echipe.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].Constructor.name.includes(fav)) {
      favArr.value = arr[i]
    }
  }
}
async function getFavDriver() {
  const resp = await axios(
    `${import.meta.env.VITE_API_LINK}/mongo/piloti/${store.user.favDriver}`
  )
  favDriv.value = resp.data[0]
}
if (user != null && store.user.favTeam != null) {
  await favoriteTeam()
  bla.value = true
}
if (user != null && store.user.favDriver != null) {
  await getFavDriver()
  driverOk.value = true
}
async function updateDb() {
  await axios({
    method: "POST",
    url: `${import.meta.env.VITE_API_LINK}/profile/change/team/${
      currentEnc.currentUser
    }`,
    data: {
      favTeam: echipaPref.value,
      favDriver: soferPref.value,
    },
  })
  if(store.user.favTeam !== echipaPref.value){
    store.user.favTeam = echipaPref.value
    await favoriteTeam()
  }
  if(store.user.favDriver !== soferPref.value){
    store.user.favDriver = soferPref.value
    await getFavDriver()
  }
}
if (favArr.value === null) {
  bla.value = false
}

onMounted(async () => {
  document.title = "Profile" + "-" + user.displayName
  router.push({ query: { user: store.user.displayName } })
  await getAllDrivers()
  await getDataFull()
  showSelect.value = true
  if (soferPref.value === "") {
    soferPref.value = soferPrefdata.value
  }
  if (echipaPref.value === "") {
    echipaPref.value = echipaPrefdata.value
  }
})
</script>

<style scoped>
@import "../../assets/formSelect-curse.css";
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(#141e30, #243b55);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}
.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.login-box a:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
    0 0 100px #03e9f4;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
