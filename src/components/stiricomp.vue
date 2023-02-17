<template>
  <div v-if="show">
    <div class="stiri" :class="{ darkmode: darkMode }">
      <div class="titlu">
        <div>
          <img src="/checker.webp" class="titlu-poza" />
        </div>
        <div class="titlu-text">Știri de ultimă oră</div>
        <div>
          <img src="/checker.webp" class="titlu-poza" />
        </div>
      </div>
    </div>
    <Teleport to=".stiri-grid">
      <div class="scroll-btns">
        <button class="darkmodeBtn" @click="darkModeToggle()">
          <img
            src="/night-mode.png"
            class="poza1"
            :class="{ darkmode: darkMode }"
          />
          <img
            src="/brightness.png"
            class="poza2"
            :class="{ darkmode: darkMode }"
          />
        </button>
      </div>
    </Teleport>
    <div class="content-grid" :class="{ darkmode: darkMode }">
      <a
        :href="stire.link"
        v-for="stire in news"
        v-bind:key="stire.id"
        class="ltag"
        :class="{ darkmode: darkMode }"
        target="_blank"
        v-motion-slide-right
      >
        <div class="stire">
          <div class="content-row">
            <div class="content-text" :class="{ darkmode: darkMode }">
              <p class="text" id="stiretext">{{ stire.titlu }}</p>
            </div>
            <div class="content-photo">
              <img :src="stire.poza" class="photo" id="stirephoto" />
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
  <div class="loading" v-if="!show">
    <ProgressSpinner />
  </div>
</template>

<script>
import axios from "axios"
import { isItemInSessionStorage } from "../functions/checkSessionS.js"
import { checkDarkMode } from "../functions/checkDarkMode.js"
export default {
  name: "Stiri",
  data() {
    let darkMode = localStorage.getItem("darkMode") == "true"
    return {
      news: [],
      show: false,
      darkMode,
      raspuns: [],
    }
  },
  mounted() {
    this.fetchData()
    checkDarkMode(this.darkMode)
  },
  methods: {
    darkModeToggle() {
      this.darkMode = !this.darkMode
      localStorage.setItem("darkMode", this.darkMode)
      checkDarkMode(this.darkMode)
    },
    async fetchData() {
      let now = new Date()
      let sessionData = JSON.parse(sessionStorage.getItem("news"))
      if (
        isItemInSessionStorage("news") == 0 ||
        sessionData.exp < now.toISOString()
      ) {
        var numar = 6
        var link = `${import.meta.env.VITE_API_LINK}/mongo/stiri/${numar}`
        const response = await axios.get(link)
        const resData = response.data
        this.news = resData
        if (this.news !== undefined) {
          this.show = true
        }
        let expiration = new Date()
        expiration.setMinutes(expiration.getMinutes() + 30)
        const storeItem = {
          exp: expiration,
          data: resData,
        }
        sessionStorage.setItem("news", JSON.stringify(storeItem))
      } else {
        const data = JSON.parse(sessionStorage.getItem("news"))
        this.news = data.data
        if (this.news !== undefined) {
          this.show = true
        }
      }
    },
  },
}
</script>
