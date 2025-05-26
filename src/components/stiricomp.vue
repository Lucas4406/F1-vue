<template>
  <div class="px-4 py-8 space-y-12">
    <!-- Titlu general -->
    <div class="flex items-center justify-center gap-4">
      <h2 class="text-4xl font-bold text-center text-black flex items-center justify-center gap-2 source">
        🏁 Latest News 🏁
      </h2>
    </div>

    <!-- Grid pentru ambele surse -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 mt-8 max-w-7xl mx-auto">
      <!-- Stiri Formula1.com (cu poze) -->
      <a
          v-for="stire in news"
          :key="'f1-' + stire.id"
          :href="stire.link"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-300 overflow-hidden flex flex-col w-full min-h-[460px] racefansgrid"
      >
        <img
            :src="stire.poza"
            :alt="stire.titlu"
            class="w-full h-60 object-cover"
        />
        <div class="p-6 flex flex-col justify-between flex-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-3 leading-snug">
            {{ stire.titlu }}
          </h3>
          <span class="text-sm text-gray-400 mt-auto">Source: Formula1.com</span>
        </div>
      </a>

      <!-- Stiri RaceFans (fără poze) -->
      <a
          v-for="stire in newsRF"
          :key="'rf-' + stire._id"
          :href="stire.linkPost"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 flex flex-col w-full min-h-[460px] racefansgrid"
      >
        <div class="p-5 flex flex-col h-full">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{{ stire.titlu }}</h3>

          <p class="text-sm sm:text-base text-gray-500 mb-1">
            <strong>Author:</strong> {{ stire.autor || "Unknown" }}
          </p>
          <p class="text-sm sm:text-base text-gray-500 mb-1">
            <strong>Published:</strong> {{ formatDate(stire.dataPublicare) }}
          </p>

          <p class="text-sm sm:text-base text-gray-700 mt-2 line-clamp-4 flex-1">
            {{ stire.descriere }}
          </p>

          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs sm:text-sm text-gray-400">{{ stire.categorii?.[0] }}</span>
            <span class="text-sm sm:text-base text-blue-600 hover:underline read-more">Read more →</span>
          </div>

          <span class="text-sm sm:text-base text-gray-400 mt-4 block">Source: RaceFans.net</span>
        </div>
      </a>
    </div>

    <!-- Loader -->
    <div class="flex justify-center items-center mt-8" v-if="!show">
      <ProgressSpinner />
    </div>
  </div>
</template>




<script>
import axios from "axios"
import { isItemInSessionStorage } from "@/functions/checkSessionS.js"

export default {
  name: "Stiri",
  data() {
    return {
      news: [],
      newsRF: [],
      show: false,
    }
  },
  mounted() {
    this.fetchData()
    this.fetchRaceFansNews()
  },
  methods: {
    async fetchData() {
      let now = new Date()
      let sessionData = JSON.parse(sessionStorage.getItem("news"))
      if (
          isItemInSessionStorage("news") == 0 ||
          sessionData.exp < now.toISOString()
      ) {
        const link = `${import.meta.env.VITE_API_LINK}/mongo/stiri/6`
        const response = await axios.get(link)
        const resData = response.data
        this.news = resData
        let expiration = new Date()
        expiration.setMinutes(expiration.getMinutes() + 30)
        sessionStorage.setItem(
            "news",
            JSON.stringify({ exp: expiration, data: resData })
        )
      } else {
        this.news = sessionData.data
      }
      this.show = true
    },

    async fetchRaceFansNews() {
      const storageKey = "news_rf"
      const now = new Date()
      const sessionData = JSON.parse(sessionStorage.getItem(storageKey))

      if (!sessionData || sessionData.exp < now.toISOString()) {
        try {
          const link = `${import.meta.env.VITE_API_LINK}/mongo/stiri-rf/all`
          const response = await axios.get(link)
          const resData = response.data
          this.newsRF = resData
          const expiration = new Date()
          expiration.setMinutes(expiration.getMinutes() + 30)
          sessionStorage.setItem(
              storageKey,
              JSON.stringify({ exp: expiration, data: resData })
          )
        } catch (error) {
          console.error("Eroare la fetch news_rf:", error)
        }
      } else {
        this.newsRF = sessionData.data
      }
      this.show = true
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("ro-RO", options)
    },
  },
}
</script>

<style>
.racefansgrid {
  transition: transform 0.2s ease-in-out;
}

.racefansgrid:hover {
  transform: scale(1.02) translateY(-5px);
}
</style>