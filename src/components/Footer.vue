<template>
  <div class="bg-black text-red-500 px-6 py-4 sm:py-10 sm:px-10">
    <div class="flex flex-col lg:flex-row justify-between items-center gap-6">

      <!-- LOGIN / PROFIL -->
      <div v-if="!isLoggedIn" class="flex gap-4">
        <router-link to="/login" class="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-400 transition">Log In</router-link>
        <router-link to="/signup" class="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-400 transition">Sign Up</router-link>
      </div>

      <div v-else class="flex items-center gap-4 bg-white text-gray-700 px-4 py-3 rounded-lg shadow">
        <router-link to="/profile">
          <img
              class="w-14 h-14 rounded-full border object-cover"
              :src="Poza"
              alt="profile-picture"
              v-if="profilePic"
          />
        </router-link>
        <div class="flex flex-col">
          <div class="text-md font-semibold">{{ Name }}</div>
          <div class="text-sm text-gray-500">{{ Email }}</div>
        </div>
        <div class="flex gap-2 ml-4">
          <router-link to="/profile" class="p-2 rounded bg-red-500 hover:bg-red-400 transition">
            <svg class="w-6 h-6 text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="16" cy="16" r="15" />
              <circle cx="16" cy="11" r="6" />
              <path d="M26 27c0-5.5-4.5-10-10-10S6 21.5 6 27" />
            </svg>
          </router-link>
          <button @click="logout" class="p-2 rounded bg-red-500 hover:bg-red-400 transition border-0 cursor-pointer" >
            <svg class="w-6 h-6 text-white" viewBox="0 0 1024 1024" fill="currentColor">
              <path
                  d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- INFO LEGAL & COPYRIGHT -->
      <div class="flex flex-col items-center lg:items-end text-center lg:text-right gap-2">
        <p class="text-white text-sm sm:text-base">© 2025 GridFanHub | F1 news & data</p>
        <div class="flex gap-4 text-white text-sm sm:text-base underline">
          <router-link to="/sources" class="text-white">Sources</router-link>
          <a href="https://www.privacypolicies.com/live/c7de1b24-3f41-4ea2-a495-0216f2d3c0a4" class="text-white" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
        <!-- Dark Mode Toggle -->
        <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 hover:text-white transition text-black mt-4"
            @click="darkModeToggle"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-12.66l-.71.71M4.05 19.95l-.7-.71m16.97 0l-.71.71M4.05 4.05l-.7.71M21 12h-1M4 12H3m9-9a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.293 14.707A8 8 0 019.293 6.707 8 8 0 0012 20a8 8 0 005.293-5.293z" />
          </svg>
          <span class="text-sm hidden sm:inline">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { onMounted, ref } from "vue"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
const isLoggedIn = ref(false)
const profilePic = ref(false)
const Name = ref("")
const Email = ref("")
const Poza = ref("")
let auth
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const current = {
        User: user.email,
        Username: user.displayName,
        currentUser: user.uid,
      }
      localStorage.setItem("currentUser", JSON.stringify(current))
      Name.value = user.displayName
      Email.value = user.email
      if (user.photoURL != null) {
        Poza.value = user.photoURL
        profilePic.value = true
      } else {
        profilePic.value = false
      }
      isLoggedIn.value = true
    } else {
      localStorage.setItem("currentUser", null)
      isLoggedIn.value = false
    }
  })
})
function logout() {
  signOut(auth).then(() => {
    window.location.reload()
  })
}
const isDark = ref(localStorage.getItem("darkMode") === "true")

function darkModeToggle() {
  isDark.value = !isDark.value
  localStorage.setItem("darkMode", isDark.value)
  if (isDark.value) {
    document.documentElement.classList.add("darkmode")
  } else {
    document.documentElement.classList.remove("darkmode")
  }
}
</script>

<style scoped>
.text-xxs {
  font-size: 0.7em;
}
.router-link-exact-activ {
  opacity: 1;
}
.router-link-activ {
  opacity: 1;
}
</style>
