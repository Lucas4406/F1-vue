<template>
  <div class="header">
    <div class="sus">
      <div class="logo">
        <router-link to="/" class="link-router"><img src="./icons/f1.png" class="logo-f1" /></router-link>
      </div>
      <div class="fia">
        <a href="https://www.fia.com/" target="_blank">
          <img src="./icons/imageedit_3_3849553840.png" class="logo-fia" />
        </a>
      </div>
    </div>
    <div class="bar">
      <div class="buton">
        <router-link to="/program" class="link-router">Program</router-link>
      </div>
      <div class="buton">
        <router-link to="/echipe" class="link-router">Echipe</router-link>
      </div>
      <div class="buton" id="buton-dpd" data-dropdown>
        <p style="color: red; margin: 0" data-dropdown-button>Clasament</p>
        <div class="dropdown-menu">
          <router-link to="/clasament-echipe" class="text-dropdown">Echipe</router-link>
          <router-link to="/clasament-piloti" class="text-dropdown">Piloți</router-link>
        </div>
      </div>
      <div class="buton" id="buton-dpd" data-dropdown>
        <p style="color: red; margin: 0" data-dropdown-button>Rezultate</p>
        <div class="dropdown-menu">
          <router-link to="/rezultate-curse/2022" class="text-dropdown">Curse</router-link>
          <router-link to="/rezultate-calificari/2022" class="text-dropdown">Calificări</router-link>
        </div>
      </div>
      <div class="buton">
        <router-link to="/joc" class="link-router">Joc</router-link>
      </div>
      <div class="buton">
        <router-link to="/istorie" class="link-router">Istorie</router-link>
      </div>
      <div class="buton" v-if="isLogged">
        <profileBadge />
      </div>
    </div>
  </div>
  <router-view/>
</template>


<script setup>
   import { onMounted , ref } from 'vue'
   import profileBadge from "./profile-badge.vue"
  import { inject } from "vue"
  const store = inject("store")
  const isLogged = ref(false)
  if(store.state.email != null){
    isLogged.value = true
  }
   onMounted(() => {
     document.addEventListener("click", (e) => {
         const isDropdownButton = e.target.matches("[data-dropdown-button]");
       if (!isDropdownButton && e.target.closest("[data-dropdown]") != null)
         return
       let currentDropdown
       if (isDropdownButton) {
           currentDropdown = e.target.closest("[data-dropdown]")
         currentDropdown.classList.toggle("active")
       }
       document
         .querySelectorAll("[data-dropdown].active")
         .forEach((dropdown) => {
             if (dropdown === currentDropdown) return
           dropdown.classList.remove("active")
         })
     })
   })
</script>

<style>
 @import "./css/navbar.css";
</style>