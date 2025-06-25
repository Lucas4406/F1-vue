<template>
  <div class="px-4 py-8 space-y-12">
    <div class="flex flex-col items-center gap-2">
      <h2 class="text-5xl lg:text-4xl font-bold text-center text-black source">
        🏁 Latest News 🏁
      </h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 mt-8 max-w-7xl mx-auto">
      <!-- Toate știrile F1 -->
      <StireF1Card v-for="stire in news" :key="'f1-' + stire.id" :stire="stire" />

      <!-- Primele 4 sau toate RaceFans -->
      <StireRaceFansCard
          v-for="stire in (showAllRF ? newsRF : newsRF.slice(0, displayLimitRF))"
          :key="'rf-' + stire._id"
          :stire="stire"
      />
    </div>

    <!-- Buton See More doar pentru RaceFans -->
    <div class="flex justify-center mt-4" v-if="newsRF.length > displayLimitRF">
      <ReusableButton  @Click="showAllRF = !showAllRF">
        {{ showAllRF ? 'See less RaceFans news' : 'See more RaceFans news' }}
      </ReusableButton>
    </div>

    <div class="flex justify-center items-center mt-8" v-if="!show">
      <ProgressSpinner />
    </div>
  </div>
</template>


<script setup>
import axios from "axios"
import StireF1Card from "@/components/StireF1Card.vue"
import StireRaceFansCard from "@/components/StireRaceFansCard.vue"
import ReusableButton from "@/components/ReusableButton.vue"

import { ref, onMounted } from "vue"
import {makeRequest} from "@/functions/makeRequest";

const news = ref([])
const newsRF = ref([])
const show = ref(false)
const lastUpdate = ref(null)
const showAllRF = ref(false)
const displayLimitRF = 2

onMounted(async () => {
  try {
    const [f1, rf] = await Promise.all([
      fetchWithCache("news", `${import.meta.env.VITE_API_LINK}/api-news-f/view?limit=6`),
      fetchWithCache("news_rf", `${import.meta.env.VITE_API_LINK}/mongo/stiri-rf/all`)
    ])
    news.value = f1
    newsRF.value = rf
    lastUpdate.value = new Date()
  } catch (error) {
    console.error("Eroare la fetch știri:", error)
  } finally {
    show.value = true
  }
})

async function fetchWithCache(key, url) {
  const now = new Date()
  const cached = JSON.parse(sessionStorage.getItem(key))

  if (!cached || cached.exp < now.toISOString()) {
    const { data } = await axios.get(url)
    const expiration = new Date()
    expiration.setMinutes(expiration.getMinutes() + 30)
    sessionStorage.setItem(key, JSON.stringify({ exp: expiration, data }))
    return data
  } else {
    return cached.data
  }
}
</script>

<style>
.racefansgrid .img-wrapper {
  overflow: hidden;
}

.racefansgrid .img-wrapper img {
  transition: transform 0.3s ease-in-out;
  will-change: transform;
}

.racefansgrid:hover .img-wrapper img {
  transform: scale(1.03);
}
</style>
