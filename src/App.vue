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
</template>

<script>
import Navbar from "./components/Navbar.vue"
import Footertag from "./components/Footer.vue"
import axios from "axios"
import GreetingPageVue from "./components/GreetingPage.vue"
import darkModeBtn from "./components/darkModeBtn.vue"

export default {
  name: "App",
  inject: ["store"],
  components: {
    Navbar,
    Footertag,
    GreetingPageVue,
    darkModeBtn,
  },
  data() {
    return {
      loaded: false,
      select: false,
    }
  },
  async mounted() {
    let currUser = JSON.parse(localStorage.getItem("currentUser"))
    if (currUser != null) {
      await this.getUserData(currUser.currentUser)
    }
    this.loaded = true
  },
  created() {
    setTimeout(async () => {
      await axios.get(`${import.meta.env.VITE_API_LINK}/stiri-translate/6`)
    }, 6000)
  },
  methods: {
    async getUserData(user) {
      const response = await axios(
        `${import.meta.env.VITE_API_LINK}/profile/${user}`
      )
      if (response != null) {
        const data = response.data[0]
        this.store.user = data
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
