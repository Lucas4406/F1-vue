<template>
  <div class="header" id="header">
    <div class="sus">
      <div class="logo">
        <router-link to="/" class="link-router"
          ><img src="./icons/ferrari.avif" class="logo-f1" alt="website logo"
        /></router-link>
      </div>
      <div class="fia peste" v-if="isLogged" v-once>
        <profileBadge class="peste" />
      </div>
    </div>
    <div class="bar">
      <div class="buton">
        <router-link to="/program" class="link-router">Schedule</router-link>
      </div>
      <div class="buton">
        <router-link to="/echipe" class="link-router">Teams</router-link>
      </div>
      <div class="buton" id="buton-dpd" data-dropdown>
        <p style="color: red; margin: 0" data-dropdown-button>Standings</p>
        <div class="dropdown-menu">
          <router-link to="/clasament-echipe" class="text-dropdown"
            >Teams</router-link
          >
          <router-link to="/clasament-piloti" class="text-dropdown"
            >Drivers</router-link
          >
        </div>
      </div>
      <div class="buton" id="buton-dpd" data-dropdown>
        <p style="color: red; margin: 0" data-dropdown-button>Results</p>
        <div class="dropdown-menu">
          <router-link to="/rezultate-curse/2025" class="text-dropdown"
            >Races</router-link
          >
          <router-link to="/rezultate-calificari/2025" class="text-dropdown"
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
          <router-link to="/joc" class="text-dropdown-right">Game</router-link>
          <router-link
            to="/istorie"
            class="text-dropdown-right"
            :class="{ logat: isLogged }"
            >History</router-link
          >
          <router-link
            to="/login"
            class="text-dropdown-right"
            :class="{ logat: isLogged }"
            v-if="!isLogged"
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
</style>
