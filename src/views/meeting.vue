<script>
import axios from "axios";
import tabelcursa from "@/components/tabelcursa.vue";
import tabelcali from "@/components/tabelcali.vue";
import Tabelsprint from "@/components/tabelsprint.vue";
export default {
  name: "Meeting",
  components: {Tabelsprint, tabelcali, tabelcursa},
  data() {
    return {
      an: this.$route.params.an,
      meetingName: this.$route.params.meeting_name,
      curse: null,
      nrCursa: null,
      cursaData: null,
      sprintData: null,
      qualiData: null,
      raceControlLast: null,
      sessionKey: null,
      nrRundaActuala: null,
    }
  },
  methods: {
    async fetchData (link){
      const date = await axios.get(link)
      return date.data
    },
    async getData () {
      let isSprint = false
      const meetingNameSpace = this.meetingName.replaceAll('_' , " ")
      const response = await this.fetchData(`https://api.jolpi.ca/ergast/f1/${this.an}.json?limit=100`)
      const resData = response.MRData.RaceTable.Races
      this.curse = resData
      for(let i = 0 ; i<resData.length; i++) {
        if(meetingNameSpace === resData[i].raceName) {
          this.nrCursa = i
        }
      }
      const res = await this.fetchData(`${import.meta.env.VITE_API_LINK}/mongo/RaceData/all`)
      this.sessionKey = res[this.nrCursa].fomRaceId
      const nrRunda = await this.fetchData(`${import.meta.env.VITE_API_LINK}/get-next`)
      this.nrRundaActuala = nrRunda.meetingContext.nr_runda
      const linkFormat = `https://api.jolpi.ca/ergast/f1/${this.an}/${this.nrCursa + 1}`
      const terminare = ".json?limit=100"
      const qualiData = await this.fetchData(linkFormat + "/qualifying" + terminare)
      const qualiDataFormat = qualiData.MRData.RaceTable.Races[0]
      if(qualiDataFormat !== undefined) {
        this.qualiData = qualiDataFormat
      }
      const raceData = await this.fetchData(linkFormat + "/results" + terminare)
      const raceDataFormat = raceData.MRData.RaceTable.Races[0]
      if (raceDataFormat !== undefined) {
        for (const result of raceDataFormat.Results) {
          result.FastestLap = result.FastestLap?.Time?.time || "-";
        }
        this.cursaData = raceDataFormat
      }
      if(resData[this.nrCursa].Sprint !== undefined){
        isSprint = true
      }
      if(isSprint === true){
        const sprintData = await this.fetchData(linkFormat + "/sprint" + terminare)
        const sprintDataFormat = sprintData.MRData.RaceTable.Races[0]
        for (const result of sprintDataFormat.SprintResults) {
          result.FastestLap = result.FastestLap?.Time?.time || "-";
        }
        this.sprintData = sprintDataFormat
      }
    },
    async getOpenApiData() {
      const dateOpen = await this.fetchData(`https://api.openf1.org/v1/sessions?year=${this.an}&meeting_key=${this.sessionKey}`)
      const sesiuniInvers = dateOpen.reverse()
      const keyUltima = sesiuniInvers[0].session_key

      const raceControlDataUltima = await this.fetchData(`https://api.openf1.org/v1/race_control?meeting_key=${this.sessionKey}&session_key=${keyUltima}`)
      this.raceControlLast = raceControlDataUltima.reverse()
      console.log("updated")
    },
    formatDate(dateStr) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Bucharest',   // 🕒 Ora României
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
    }
  },
  async mounted() {
    await this.getData()
    await this.getOpenApiData()

    if(this.nrCursa === this.nrRundaActuala){
      // Rulează getOpenApiData la fiecare 10 secunde
      this.interval = setInterval(() => {
        this.getOpenApiData()
      }, 10000) // 10 secunde = 10000 ms
    }
  },
  beforeUnmount() {
    // Curăță intervalul când componenta se distruge
    clearInterval(this.interval)
  },
}
</script>

<template>
  <br />
  <div class="container-curse">
    <p class="titlu-pagina-curse">{{ "Rezultate " + meetingName.replaceAll("_" , " ") + " " + an }}</p>
    <p class="titlu-pagina-curse" v-if="!cursaData && !qualiData && !sprintData" >Rezultatele vor aparea dupa finalizarea sesiunii respective</p>
    <p class="titlu-pagina-curse" v-if="cursaData">Rezultate cursa</p>
    <tabelcursa :cursa="cursaData" v-if="cursaData"/>
    <br v-if="cursaData" />
    <p class="titlu-pagina-curse" v-if="qualiData">Rezultate calificari</p>
    <tabelcali
        :qualiData="qualiData" v-if="qualiData"
    />
    <br v-if="sprintData" />
    <p class="titlu-pagina-curse" v-if="sprintData">Rezultate sprint</p>
    <tabelsprint :cursa="sprintData" v-if="sprintData"/>
    <br />
    <p class="titlu-pagina-curse" v-if="raceControlLast">Race control ultima sesiune</p>
    <div class="p-4 max-w-xl mx-auto">
      <div
          class="grid grid-cols-1 gap-4 bg-white shadow-md rounded-2xl p-6 border-solid border-black"
          v-for="(mesaj, index) in raceControlLast"
          :key="index"
      >
        <h2 class="text-xl font-semibold text-red-600">
          {{ mesaj.message }}
        </h2>
        <p class="text-sm text-gray-500 mb-2">
          {{ formatDate(mesaj.date) }}
        </p>

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

<style scoped>
@import "../assets/curse.css";
</style>
