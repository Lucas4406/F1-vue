<script>
import { defineAsyncComponent } from "vue"
import axios from "axios"
import tabelcursa from "@/components/tabelcursa.vue"
import tabelcali from "@/components/tabelcali.vue"
import Tabelsprint from "@/components/tabelsprint.vue"
import { useHead } from "@vueuse/head"
import getNext from "@/functions/getNext"
import {makeRequest} from "@/functions/makeRequest";
import PracticeResultsTable from "@/components/PracticeResultsTable.vue";

export default {
  name: "Meeting",
  components: {
    PracticeResultsTable,
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
      fp1Results: null,
      fp2Results: null,
      fp3Results: null,
    }
  },
  computed: {
    meetingNameFormatted() {
      return this.formatMeetingName(this.meetingName)
    }
  },
  methods: {
    formatMeetingName(slug) {
      return slug
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
    },
    async fetchData(link) {
      const res = await axios.get(link)
      return res.data
    },
    async getData() {
      const meetingNameSpace = this.meetingName.replaceAll("-", " ")
      const res = await this.fetchData(`https://api.jolpi.ca/ergast/f1/${this.an}.json?limit=100`)
      this.curse = res.MRData.RaceTable.Races

      for (let i = 0; i < this.curse.length; i++) {
        if (meetingNameSpace === this.curse[i].raceName.toLowerCase()) {
          this.nrCursa = i
          break
        }
      }

      const raceRes = await this.fetchData(`${import.meta.env.VITE_API_LINK}/mongo/race-data/all`)
      this.sessionKey = raceRes[this.nrCursa].fomRaceId

      const runda = await getNext
      this.nrRundaActuala = runda.meetingContext.nr_runda
      const meetingYear = runda.meetingContext.season
      const meetingPath = this.sessionKey + "_" + this.meetingName
      const base_practice_link = `${import.meta.env.VITE_API_LINK}/api-latest-session-f/view/${meetingYear}/${meetingPath}`

      const linkBase = `https://api.jolpi.ca/ergast/f1/${this.an}/${this.nrCursa + 1}`
      const terminare = ".json?limit=100"

      const raceData = await this.fetchData(linkBase + "/results" + terminare)
      const race = raceData.MRData.RaceTable.Races[0]

      const qualiData = await this.fetchData(linkBase + "/qualifying" + terminare)
      this.qualiData = qualiData.MRData.RaceTable.Races[0]

      if(this.nrCursa > 9){
        let base_data = null;
        try {
          base_data = await makeRequest(base_practice_link)
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log("Practice data not found. Skipping practice sessions.");
          } else {
            console.error("Error fetching practice data:", err);
          }
        }
        if(base_data && base_data.sessions){
          const lastSessions = Object.keys(base_data.sessions)
          for(let i = 0 ; i < lastSessions.length; i++) {
            const session = lastSessions[i];
            const session_text = session
            const session_key = "raceResults" + session_text.charAt(0).toUpperCase() + session_text.slice(1)
            const sessionData = await this.getPracticeSessionData(base_practice_link, session_text)
            if(session === "practice1"){
              this.fp1Results = sessionData.data[session_key]
            }
            if(session === "practice2"){
              this.fp2Results = sessionData.data[session_key]
            }
            if(session === "practice3"){
              this.fp3Results = sessionData.data[session_key]
            }
          }
        }
      }

      if (race?.Results) {
        race.Results.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"))
        this.cursaData = race
      }

      if (this.curse[this.nrCursa]?.Sprint) {
        const sprintData = await this.fetchData(linkBase + "/sprint" + terminare)
        const sprint = sprintData.MRData.RaceTable.Races[0]
        sprint.SprintResults.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"))
        this.sprintData = sprint
      }
    },
    async getPracticeSessionData(basePath, sessionName){
      return await makeRequest(basePath + `/${sessionName}`)
    }
    // async getToateSesiunile() {
    //   const sesiuni = await this.fetchData(
    //       `https://api.openf1.org/v1/sessions?year=${this.an}&meeting_key=${this.sessionKey}`
    //   )
    //   this.sesiuniOrdinate = sesiuni.sort((a, b) => b.session_key - a.session_key)
    // }
  },
  async mounted() {
    await this.getData()
    // await this.getToateSesiunile()

    // Setare document title
    document.title = this.meetingNameFormatted + " " + this.an + " results"

    // Setare meta tags cu useHead
    useHead({
      title: `GridFanHub | ${this.meetingNameFormatted} ${this.an} Results`,
      meta: [
        {
          name: "description",
          content: `See all results from the ${this.meetingNameFormatted} ${this.an} Formula 1 weekend: race, qualifying, sprint and race control messages on GridFanHub.`,
        },
        {
          name: "keywords",
          content: `${this.meetingNameFormatted} ${this.an} F1, GridFanHub, F1 race control, formula1, f1, finishing order, Formula 1 ${this.an} ${this.meetingNameFormatted} results, F1 qualifying, F1 sprint results, ${this.an} F1 race outcome, race control messages, race control`,
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          property: "og:title",
          content: `GridFanHub | ${this.meetingNameFormatted} ${this.an} Results`,
        },
        {
          property: "og:description",
          content: `Catch up on all sessions from ${this.meetingNameFormatted} ${this.an}. View race, qualifying, and sprint results and race control messages.`,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: `https://gridfanhub.com/schedule/${this.an}/${this.meetingName}`,
        },
        {
          property: "og:image",
          content: "https://gridfanhub.com/favicon.ico",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: `GridFanHub | ${this.meetingNameFormatted} ${this.an} Results`,
        },
        {
          name: "twitter:description",
          content: `Results from ${this.meetingNameFormatted} ${this.an} — check out qualifying, sprint, race results and race control messages in one place.`,
        },
        {
          name: "twitter:image",
          content: "https://gridfanhub.com/favicon.ico",
        },
      ],
      link: [
        {
          rel: "canonical",
          href: `https://gridfanhub.com/schedule/${this.an}/${this.meetingName}`,
        },
      ],
    })
  }
}
</script>


<template>
  <div class="container-curse pt-2 mb-10">
    <div class="text-center mb-12">
      <h1 class="text-6xl lg:text-5xl font-bold tracking-tight source text-black">
        {{ meetingNameFormatted + " results" }}
      </h1>
      <p class="mt-2 text-xl lg:text-lg text-gray-500 ">{{an}} Season</p>
    </div>

    <p v-if="!cursaData && !qualiData && !sprintData && !fp1Results && !fp2Results && !fp3Results" class="titlu-pagina-curse">
      Results will appear after the session has ended
    </p>
    <template v-if="cursaData">
      <h2 class="titlu-pagina-curse">Race results</h2>
      <tabelcursa :cursa="cursaData" />
      <br />
    </template>

    <template v-if="qualiData">
      <h2 class="titlu-pagina-curse">Qualifying results</h2>
      <tabelcali :qualiData="qualiData" />
      <br />
    </template>

    <template v-if="sprintData">
      <h2 class="titlu-pagina-curse">Sprint results</h2>
      <Tabelsprint :cursa="sprintData" />
      <br />
    </template>
    <PracticeResultsTable :results="fp3Results.results" :session-name="fp3Results.description" v-if="fp3Results" />
    <PracticeResultsTable :results="fp2Results.results" :session-name="fp2Results.description" v-if="fp2Results" />
    <PracticeResultsTable :results="fp1Results.results" :session-name="fp1Results.description" v-if="fp1Results" />

<!--    <h2 class="titlu-pagina-curse" v-if="sesiuniOrdinate.length">Race Control messages</h2>-->
<!--    <Suspense>-->
<!--      <template #default>-->
<!--        <AccordionMesaje-->
<!--            v-for="(sesiune, index) in sesiuniOrdinate"-->
<!--            :key="sesiune.session_key"-->
<!--            :title="'Session messages: ' + sesiune.session_name"-->
<!--            :sessionKey="sesiune.session_key"-->
<!--            :meetingKey="sessionKey"-->
<!--            :esteUltimul="index === 0"-->
<!--            :meetingName="meetingNameFormatted"-->
<!--        />-->
<!--      </template>-->
<!--      <template #fallback>-->
<!--        <p class="text-sm text-gray-500">Loading</p>-->
<!--      </template>-->
<!--    </Suspense>-->
  </div>
</template>

<style scoped>
@import "../assets/curse.css";
</style>
