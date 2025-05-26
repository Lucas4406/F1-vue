<script>
import { defineAsyncComponent } from "vue"
import axios from "axios"
import tabelcursa from "@/components/tabelcursa.vue"
import tabelcali from "@/components/tabelcali.vue"
import Tabelsprint from "@/components/tabelsprint.vue"
import AccordionMesaje from "@/components/AccordionMesaje.vue"

export default {
  name: "Meeting",
  components: {
    Tabelsprint,
    tabelcali,
    tabelcursa,
    AccordionMesaje: defineAsyncComponent(() =>
        import("@/components/AccordionMesaje.vue")
    ),
  },
  data() {
    return {
      an: this.$route.params.an,
      meetingName: this.$route.params.meeting_name,
      curse: null,
      nrCursa: null,
      cursaData: null,
      sprintData: null,
      qualiData: null,
      sessionKey: null,
      nrRundaActuala: null,
      sesiuniOrdinate: [],
    }
  },
  methods: {
    async fetchData(link) {
      const res = await axios.get(link)
      return res.data
    },
    async getData() {
      const meetingNameSpace = this.meetingName.replaceAll("_", " ")
      const res = await this.fetchData(`https://api.jolpi.ca/ergast/f1/${this.an}.json?limit=100`)
      this.curse = res.MRData.RaceTable.Races

      for (let i = 0; i < this.curse.length; i++) {
        if (meetingNameSpace === this.curse[i].raceName) {
          this.nrCursa = i
          break
        }
      }

      const raceRes = await this.fetchData(`${import.meta.env.VITE_API_LINK}/mongo/RaceData/all`)
      this.sessionKey = raceRes[this.nrCursa].fomRaceId

      const runda = await this.fetchData(`${import.meta.env.VITE_API_LINK}/get-next`)
      this.nrRundaActuala = runda.meetingContext.nr_runda

      const linkBase = `https://api.jolpi.ca/ergast/f1/${this.an}/${this.nrCursa + 1}`
      const terminare = ".json?limit=100"

      const qualiData = await this.fetchData(linkBase + "/qualifying" + terminare)
      this.qualiData = qualiData.MRData.RaceTable.Races[0]

      const raceData = await this.fetchData(linkBase + "/results" + terminare)
      const race = raceData.MRData.RaceTable.Races[0]
      if (race?.Results) {
        race.Results.forEach(r => r.FastestLap = r.FastestLap?.Time?.time || "-")
        this.cursaData = race
      }

      if (this.curse[this.nrCursa]?.Sprint) {
        const sprintData = await this.fetchData(linkBase + "/sprint" + terminare)
        const sprint = sprintData.MRData.RaceTable.Races[0]
        sprint.SprintResults.forEach(r => r.FastestLap = r.FastestLap?.Time?.time || "-")
        this.sprintData = sprint
      }
    },
    async getToateSesiunile() {
      const sesiuni = await this.fetchData(`https://api.openf1.org/v1/sessions?year=${this.an}&meeting_key=${this.sessionKey}`)
      this.sesiuniOrdinate = sesiuni.sort((a, b) => b.session_key - a.session_key)
    }
  },
  computed: {
    meetingNameFormatted() {
      return this.meetingName.replaceAll('_', ' ')
    }
  },
  async mounted() {
    await this.getData()
    await this.getToateSesiunile()
  }
}
</script>

<template>
  <div class="container-curse">
    <br />
    <p class="titlu-pagina-curse">{{ meetingName.replaceAll("_", " ") + " " + an + " results" }}</p>

    <p v-if="!cursaData && !qualiData && !sprintData" class="titlu-pagina-curse">
      Results will appear after the session has ended
    </p>

    <template v-if="cursaData">
      <p class="titlu-pagina-curse">Race results</p>
      <tabelcursa :cursa="cursaData" />
      <br />
    </template>

    <template v-if="qualiData">
      <p class="titlu-pagina-curse">Qualifying results</p>
      <tabelcali :qualiData="qualiData" />
      <br />
    </template>

    <template v-if="sprintData">
      <p class="titlu-pagina-curse">Sprint results</p>
      <Tabelsprint :cursa="sprintData" />
      <br />
    </template>

    <p class="titlu-pagina-curse" v-if="sesiuniOrdinate.length">Race Control messages</p>
    <Suspense>
      <template #default>
        <AccordionMesaje
            v-for="(sesiune, index) in sesiuniOrdinate"
            :key="sesiune.session_key"
            :title="'Session messages: ' + sesiune.session_name"
            :sessionKey="sesiune.session_key"
            :meetingKey="sessionKey"
            :esteUltimul="index === 0"
            :meetingName="meetingNameFormatted"
        />
      </template>
      <template #fallback>
        <p class="text-sm text-gray-500">Loading</p>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
@import "../assets/curse.css";
</style>
