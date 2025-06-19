<template>
  <div class="header" id="header">
    <div class="sus">
      <div class="logo">
        <router-link to="/" class="link-router"
          ><img src="./icons/Logo-transparent-456x139.png" class="logo-f1" alt="GridFanHub website logo"
        /></router-link>
      </div>
      <div class="fia peste" v-if="isLogged" v-once>
        <profileBadge class="peste" />
      </div>
    </div>
    <div class="bar">
      <div class="buton">
        <router-link to="/schedule" class="link-router">Schedule</router-link>
      </div>
      <div class="buton">
        <router-link to="/teams" class="link-router">Teams</router-link>
      </div>
      <div class="buton" id="buton-dpd" data-dropdown>
        <p class="dropdown-label" data-dropdown-button>
          Standings
          <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </p>
        <div class="dropdown-menu">
          <router-link to="/team-standings" class="text-dropdown" @click="closeAllDropdowns"
            >Teams</router-link
          >
          <router-link to="/drivers" class="text-dropdown" @click="closeAllDropdowns"
            >Drivers</router-link
          >
        </div>
      </div>
      <div class="buton" id="buton-dpd" data-dropdown>
        <p class="dropdown-label" data-dropdown-button>
          Results
          <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </p>
        <div class="dropdown-menu">
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
        <div class="dropdown-menu">
          <router-link to="/reaction-game" class="text-dropdown-right" @click="closeAllDropdowns">Game</router-link>
          <router-link
            to="/f1-history"
            class="text-dropdown-right"
            :class="{ logat: isLogged }"
            @click="closeAllDropdowns"
            >History</router-link
          >
          <router-link
            to="/login"
            class="text-dropdown-right"
            :class="{ logat: isLogged }"
            v-if="!isLogged"
            @click="closeAllDropdowns"
            >Login</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import store from "../store"
import profileBadge from "./profile-badge.vue"
const isLogged = ref(false)
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

onMounted(async () => {
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header")
    header.classList.toggle("scrolled", window.scrollY > 30)
  })
})
</script>

<style scoped>
@import "./css/navbar.css";
.peste {
  z-index: 999;
}
.dropdown-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: red;
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
