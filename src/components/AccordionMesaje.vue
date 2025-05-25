<template>
  <div class="border rounded-xl shadow mb-4">
    <button @click="toggleOpen" class="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold">
      {{ title }}
      <span>{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <div v-if="isOpen" class="p-4 max-w-xl mx-auto">
      <p v-if="isLoading" class="text-sm text-gray-500">Se încarcă mesaje...</p>
      <div
          class="grid grid-cols-1 gap-4 bg-white shadow-md rounded-2xl p-6 border border-black"
          v-for="(mesaj, index) in mesaje"
          :key="index"
      >
        <h2 class="text-xl font-semibold text-red-600">{{ mesaj.message }}</h2>
        <p class="text-sm text-gray-500 mb-2">{{ formatDate(mesaj.date) }}</p>

        <div class="grid grid-cols-2 text-sm text-gray-700 gap-y-1">
          <div><span class="font-medium">Driver #:</span> {{ mesaj.driver_number ?? '–' }}</div>
          <div><span class="font-medium">Lap #:</span> {{ mesaj.lap_number ?? '–' }}</div>
          <div><span class="font-medium">Category:</span> {{ mesaj.category }}</div>

          <div class="flex items-center gap-2">
            <span class="font-medium">Flag:</span>
            <span :class="getFlagClass(mesaj.flag)" class="px-2 py-0.5 rounded-full text-xs font-semibold">
              {{ mesaj.flag }}
            </span>
          </div>

          <div><span class="font-medium">Scope:</span> {{ mesaj.scope }}</div>
          <div><span class="font-medium">Sector:</span> {{ mesaj.sector ?? '–' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AccordionMesaje',
  props: {
    title: String,
    sessionKey: Number,
    meetingKey: Number,
    esteUltimul: Boolean,
    meetingName: String
  },
  data() {
    return {
      isOpen: false,
      mesaje: [],
      isLoading: false,
      interval: null,
      nrCursa: null,
      nrRundaActuala: null,
    }
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen && this.mesaje.length === 0) {
        this.fetchMesaje()
      }
    },
    async fetchMesaje() {
      this.isLoading = true
      try {
        const res = await axios.get(`https://api.openf1.org/v1/race_control?meeting_key=${this.meetingKey}&session_key=${this.sessionKey}`)
        this.mesaje = res.data.reverse()
      } catch (e) {
        console.error('Eroare la fetch:', e)
      } finally {
        this.isLoading = false
      }
    },
    async fetchData (link){
      const date = await axios.get(link)
      return date.data
    },
    async checkCurrent () {
      const response = await this.fetchData(`https://api.jolpi.ca/ergast/f1/2025.json?limit=100`)
      const resData = response.MRData.RaceTable.Races
      this.curse = resData
      for(let i = 0 ; i<resData.length; i++) {
        if(this.meetingName === resData[i].raceName) {
          this.nrCursa = i
        }
      }
      const nrRunda = await this.fetchData(`${import.meta.env.VITE_API_LINK}/get-next`)
      this.nrRundaActuala = nrRunda.meetingContext.nr_runda
    },
    formatDate(dateStr) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Bucharest',
        timeZoneName: 'short'
      }
      return new Date(dateStr).toLocaleString('ro-RO', options)
    },
    getFlagClass(flag) {
      switch (flag) {
        case 'CLEAR':
          return 'bg-green-100 text-green-800'
        case 'YELLOW':
          return 'bg-yellow-100 text-yellow-800'
        case 'RED':
          return 'bg-red-100 text-red-800'
        case 'BLUE':
          return 'bg-blue-100 text-blue-800'
        case 'DOUBLE YELLOW':
          return 'bg-yellow-300 text-yellow-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    async startInterval() {
      if (this.interval) return
      await this.checkCurrent()
      if(this.nrCursa === this.nrRundaActuala) {
        this.interval = setInterval(() => {
          this.fetchMesaje()
        }, 10000)
      }
    },
    clearInterval() {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    }
  },
  watch: {
    isOpen(val) {
      if (val && this.esteUltimul) {
        this.startInterval()
      } else {
        this.clearInterval()
      }
    }
  },
  beforeUnmount() {
    this.clearInterval()
  }
}
</script>

<style scoped>
button {
  transition: background-color 0.2s ease;
}
</style>
