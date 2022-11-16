<template>
    <Menu as="div" class="relative ml-3 cursor-pointer">
        <div>
            <MenuButton class="flex rounded-full bg-black text-md lg:focus:outline-none lg:focus:ring-2 lg:focus:ring-white lg:focus:ring-offset-2 lg:focus:ring-offset-gray-800 cursor-pointer menub">
                <img class="h-14 w-14 rounded-full profimage" :src="store.state.profilePic" alt="profile picture" />
            </MenuButton>
        </div>
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="text-xl absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-black ring-opacity-5 focus:outline-none">
            <MenuItem v-slot="{ active }">
                <router-link to="/profile" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-md text-gray-700']">Profil</router-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
                <router-link to="/updateprofile" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-md text-gray-700']">Schimbă profilul</router-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
                <p :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-md text-gray-700']" class="border-none" @click="logout">Sign out</p>
            </MenuItem>
            </MenuItems>
        </transition>
    </Menu>
  </template>
  
  <script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { inject } from "vue"
  import { useRouter } from "vue-router"
  import { getAuth, signOut } from "firebase/auth" 
  const router = useRouter()
  const store = inject("store")
  let auth
  auth = getAuth()
  function logout() {
    signOut(auth).then(() => {
        window.location.reload()
    })
}
  </script>

<style scoped>
    .menub:hover img {
        transform: scale(1.1);
    }
    .profimage{
        transition: transform 200ms ease-in-out;
    }
</style>