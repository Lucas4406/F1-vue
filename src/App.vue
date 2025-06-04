<template>
  <div id="nav" v-if="loaded">
    <Navbar />
  </div>
  <main id="main-content" v-if="loaded">
    <Suspense>
      <router-view />
    </Suspense>
  </main>
  <div id="footer" v-if="loaded">
    <Footertag />
  </div>
  <div class="loading heightt" v-if="!loaded">
    <div class="spinner"></div>
  </div>
  <div class="scroll-btns">
    <darkModeBtn />
  </div>
  <CookieBanner />
</template>

<script>
import CookieBanner from "./components/CookieBanner.vue"
import Navbar from "./components/Navbar.vue"
import Footertag from "./components/Footer.vue"
import GreetingPageVue from "./components/GreetingPage.vue"
import darkModeBtn from "./components/darkModeBtn.vue"
import { authRequest } from "@/functions/authRequest"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default {
  name: "App",
  inject: ["store"],
  components: {
    Navbar,
    Footertag,
    GreetingPageVue,
    darkModeBtn,
    CookieBanner
},
  data() {
    return {
      loaded: false,
      select: false,
    }
  },
  mounted() {
    const auth = getAuth()

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await this.getUserData(user.uid)
        } catch (err) {
          console.error("Failed to fetch user data:", err)
        }
      }
      this.loaded = true
    })
  },
  methods: {
    async getUserData(uid) {
      const response = await authRequest("GET", `${import.meta.env.VITE_API_LINK}/profile/${uid}`)
      if (response) {
        this.store.user = response.data
      }
    },
  },
}
</script>


<style>
@import "./components/css/navbar.css";
@import "./assets/main.css";
@import "./assets/darkMode.scss";
.heightt {
  height: calc(100vh - 142px);
}
.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: red;
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
