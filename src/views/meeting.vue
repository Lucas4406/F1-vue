<script>
import { defineAsyncComponent } from "vue"
import axios from "axios"
import tabelcursa from "@/components/tabelcursa.vue"
import tabelcali from "@/components/tabelcali.vue"
import Tabelsprint from "@/components/tabelsprint.vue"
import {useHead} from "@vueuse/head"
import { useRoute } from 'vue-router'
import getNext from "@/functions/getNext";

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

      const runda = await getNext
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
    document.title = this.meetingName.replaceAll("_", " ") + " " + this.an + " results"
    await this.getData()
    await this.getToateSesiunile()
  },
  setup(){
    const route = useRoute()
    const an = route.params.an
    const meetingName = route.params.meeting_name
    const meetingNameFormatted = meetingName.replaceAll('_', ' ')
    useHead({
      title: `GridFanHub | ${meetingNameFormatted} ${an} Results`,
      meta: [
        {
          name: "description",
          content: `See all results from the ${meetingNameFormatted} ${an} Formula 1 weekend: race, qualifying, sprint and race control messages on GridFanHub.`,
        },
        {
          name: "keywords",
          content: `${meetingNameFormatted} ${an} F1, GridFanHub, F1 race control, formula1, f1, finishing order, Formula 1 ${an} ${meetingNameFormatted} results, F1 qualifying, F1 sprint results, ${an} F1 race outcome, race control messages, race control`,
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          property: "og:title",
          content: `GridFanHub | ${meetingNameFormatted} ${an} Results`,
        },
        {
          property: "og:description",
          content: `Catch up on all sessions from ${meetingNameFormatted} ${an}. View race, qualifying, and sprint results and race control messages.`,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: `https://gridfanhub.com/schedule/${an}/${meetingName}`,
        },
        {
          property: "og:image",
          content: "https://gridfanhub.com/favicon.ico", // ← înlocuiește cu imaginea OG reală
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: `GridFanHub | ${meetingNameFormatted} ${an} Results`,
        },
        {
          name: "twitter:description",
          content: `Results from ${meetingNameFormatted} ${an} — check out qualifying, sprint, race results and race control messages in one place.`,
        },
        {
          name: "twitter:image",
          content: "https://gridfanhub.com/favicon.ico", // ← imagine reală
        },
      ],
      link: [
        {
          rel: "canonical",
          href: `https://gridfanhub.com/schedule/${an}/${meetingName}`,
        },
      ],
    })
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
