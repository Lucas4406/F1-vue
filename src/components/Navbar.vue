<template>
  <div class="header rounded-b-md" id="header">
      <div class="logo">
        <router-link to="/" class="link-router"
          ><img src="./icons/Logo-transparent-456x139.png" class="logo-f1" alt="GridFanHub website logo"/>
        </router-link>
      </div>
      <div class="flex flex-row justify-end gap-8 lg:justify-between h-full align-center w-4/6 button-box pr-4 lg:pr-0">
        <div class="buton">
          <router-link to="/schedule" class="link-router">Schedule</router-link>
        </div>
        <div class="buton last-meeting" v-if="meetingButtonPath">
          <router-link :to="meetingButtonPath" class="link-router">{{meetingButtonTitle}}</router-link>
        </div>
        <div class="buton" id="buton-dpd" data-dropdown>
          <p class="dropdown-label" data-dropdown-button>
            Standings
            <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5H7z"/>
            </svg>
          </p>
          <div class="dropdown-menu dropdown-mare">
            <router-link to="/teams" class="text-dropdown" @click="closeAllDropdowns"
            >Teams</router-link
            >
            <router-link to="/drivers" class="text-dropdown" @click="closeAllDropdowns"
            >Drivers</router-link
            >
          </div>
        </div>
        <div class="buton results-dropdown" id="buton-dpd" data-dropdown>
          <p class="dropdown-label" data-dropdown-button>
            Results
            <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5H7z"/>
            </svg>
          </p>
          <div class="dropdown-menu dropdown-mare">
            <router-link to="/race-results/2025" class="text-dropdown" @click="closeAllDropdowns"
            >Races</router-link
            >
            <router-link to="/qualifying-results/2025" class="text-dropdown" @click="closeAllDropdowns"
            >Qualifying</router-link
            >
          </div>
        </div>
        <div class="buton" id="buton-dpd" data-dropdown>
          <img
              src="../components/icons/hamburger.svg"
              class="w-20 h-10"
              data-dropdown-button
              alt="icon hamburger meniu"
          />
          <div class="burger-menu dropdown-mic">
            <div class="lg:hidden w-full box-padding">
              <router-link :to="meetingButtonPath" class="text-dropdown-right" @click="closeAllDropdowns" v-if="meetingButtonPath">{{meetingButtonTitle}}</router-link>
              <router-link to="/race-results/2025" class="text-dropdown-right" @click="closeAllDropdowns">Races</router-link>
              <router-link to="/qualifying-results/2025" class="text-dropdown-right" @click="closeAllDropdowns">Qualifying</router-link>
            </div>
            <router-link to="/reaction-game" class="text-dropdown-right" @click="closeAllDropdowns">Game</router-link>
            <router-link
                to="/f1-history"
                class="text-dropdown-right last-dropdown-button"
                :class="{ logat: isLogged }"
                @click="closeAllDropdowns"
            >History</router-link
            >
            <router-link
                to="/login"
                class="text-dropdown-right last-dropdown-button"
                :class="{ logat: isLogged }"
                v-if="!isLogged"
                @click="closeAllDropdowns"
            >Login</router-link
            >
          </div>
        </div>
      </div>
      <div class="fia peste" v-if="isLogged" v-once>
        <profileBadge class="peste" />
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import store from "../store"
import profileBadge from "./profile-badge.vue"
import {makeRequest} from "@/functions/makeRequest";
import getNext from "@/functions/getNext.js"
const isLogged = ref(false)
const isNext = ref(false)
const meetingButtonTitle = ref(null)
const meetingButtonPath = ref(null)
if (store.user != null) {
  isLogged.value = true
}
document.addEventListener("click", (e) => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]")
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return
  let currentDropdown
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]")
    currentDropdown.classList.toggle("active")
  }
  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
    if (dropdown === currentDropdown) return
    dropdown.classList.remove("active")
  })
})
document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
  dropdown.classList.remove("active")
})

function closeAllDropdowns() {
  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
    dropdown.classList.remove("active")
  })
}
async function checkIfShouldLoadLastRace() {
  try {
    const date = await getNext
    const now = new Date()
    const start = new Date(date.race.meetingStartDate)
    const diffMs = start - now
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays > 1) {
      const dateGetLast = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`)// presupune un helper `getLast.js` care face request la /get-last
      isNext.value = false
      meetingButtonTitle.value = "Last meeting"
      meetingButtonPath.value = `/schedule/${dateGetLast.meetingContext.season}/${dateGetLast.race.meetingName.toLowerCase().replaceAll(" ", "-")}`
    }else{
      isNext.value = true
      meetingButtonTitle.value = "Current meeting"
      meetingButtonPath.value = `/schedule/${date.meetingContext.season}/${date.race.meetingName.toLowerCase().replaceAll(" ", "-")}`
    }
  } catch (err) {
    console.log("Eroare la checkIfShouldLoadLastRace:", err)
  }
}

onMounted(async () => {
  await checkIfShouldLoadLastRace()
})
</script>

<style scoped>
@import "./css/navbar.css";
.dropdown-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--light-text);
  cursor: pointer;
  margin: 0;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

/* Rotește săgeata când dropdown-ul e deschis */
.buton.active .dropdown-arrow {
  transform: rotate(180deg);
}

</style>
