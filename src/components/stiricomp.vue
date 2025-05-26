<template>
  <div v-if="show">
    <div class="stiri">
      <div class="titlu">
        <div>
          <img src="/checker.webp" class="titlu-poza" alt="chequered flag" />
        </div>
        <div class="titlu-text">Latest news</div>
        <div>
          <img src="/checker.webp" class="titlu-poza" alt="chequered flag" />
        </div>
      </div>
    </div>
    <div class="content-grid">
      <a
        :href="stire.link"
        v-for="stire in news"
        v-bind:key="stire.id"
        class="ltag"
        target="_blank"
        rel="noopener noreferrer"
      >
        <article class="stire">
          <div class="content-row">
            <div class="content-text">
              <p class="text" id="stiretext">{{ stire.titlu }}</p>
            </div>
            <div class="content-photo">
              <v-img
                :src="stire.poza"
                class="photo"
                id="stirephoto"
              />
              <span class="sr-only">{{ stire.titlu }}</span>
            </div>
          </div>
        </article>
      </a>
    </div>
    <div class="titlu source">
      <div class="titlu-text surse">Source: Formula1.com</div>
    </div>
  </div>
  <div class="loading" v-if="!show">
    <ProgressSpinner />
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
    <div
        v-for="stire in newsRF"
        :key="stire._id"
        class="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-xl transition racefansgrid"
    >
      <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ stire.titlu }}</h3>
      <p class="text-sm text-gray-500 mb-1">
        <strong>Author:</strong> {{ stire.autor || "Unknown" }}
      </p>
      <p class="text-sm text-gray-500 mb-1">
        <strong>Published:</strong> {{ formatDate(stire.dataPublicare) }}
      </p>
      <p class="text-sm text-gray-700 mt-2 line-clamp-4">{{ stire.descriere }}</p>
      <div class="mt-4 flex justify-between items-center">
        <a
            :href="stire.linkPost"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline text-sm"
        >
          Read more →
        </a>
        <span class="text-xs text-gray-400">{{ stire.categorii?.[0] }}</span>
      </div>
    </div>
  </div>

  <div class="titlu source">
    <div class="titlu-text surse">Source: RaceFans.net</div>
  </div>
</template>

<script>
import axios from "axios"
import { isItemInSessionStorage } from "../functions/checkSessionS.js"
export default {
  name: "Stiri",
  data() {
    return {
      news: [],
      show: false,
      raspuns: [],
      newsRF: [],
    }
  },
  async mounted() {
    await this.fetchData()
    await this.fetchRaceFansNews()
  },
  methods: {
    async fetchData() {
      let now = new Date()
      let sessionData = JSON.parse(sessionStorage.getItem("news"))
      if (
        isItemInSessionStorage("news") === 0 ||
        sessionData.exp < now.toISOString()
      ) {
        var link = `${import.meta.env.VITE_API_LINK}/mongo/stiri/6`
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
        if(storeItem.data){
          sessionStorage.setItem("news", JSON.stringify(storeItem))
        }
      } else {
        const data = JSON.parse(sessionStorage.getItem("news"))
        this.news = data.data
        if (this.news !== undefined) {
          this.show = true
        }
      }
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
          this.show = true

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
        this.show = true
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("ro-RO", options)
    },
  },
}
</script>

<style scoped>
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.source{
  display: flex;
  align-items: center;
  justify-content: center;
}
.surse{
  font-size: 2rem;
}
</style>
