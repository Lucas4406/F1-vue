<template>
    <Menu as="div" class="relative ml-3 cursor-pointer">
        <div>
            <MenuButton class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer">
                <img class="h-9 w-9 rounded-full" :src="store.state.profilePic" alt="" />
            </MenuButton>
        </div>
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-black ring-opacity-5 focus:outline-none">
            <MenuItem v-slot="{ active }">
                <router-link to="/profile" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Profilul</router-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
                <router-link to="/updateprofile" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Schimba profilul</router-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
                <p :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']" class="border-none" @click="logout">Sign out</p>
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