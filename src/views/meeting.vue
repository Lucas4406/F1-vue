<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import axios from 'axios'
import tabelcursa from "@/components/tabelcursa.vue"
import tabelcali from "@/components/tabelcali.vue"
import Tabelsprint from "@/components/tabelsprint.vue"
import PracticeResultsTable from "@/components/PracticeResultsTable.vue"
import AccordionMesaje from "@/components/AccordionMesaje.vue"
import getNext from "@/functions/getNext"
import { makeRequest } from "@/functions/makeRequest"

const route = useRoute()

// state
const an = route.params.an
const meetingName = route.params.meeting_name
const curse = ref(null)
const nrCursa = ref(null)
const cursaData = ref(null)
const sprintData = ref(null)
const qualiData = ref(null)
const sessionKey = ref(null)
const nrRundaActuala = ref(null)
const fpResults = ref([])

// utils
const formatMeetingName = (slug) =>
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const meetingNameFormatted = computed(() => formatMeetingName(meetingName))

// api calls
const fetchData = async (link) => {
  const res = await axios.get(link)
  return res.data
}

const getPracticeResults = (data) => {
  if(data.raceResultsPractice1) return data.raceResultsPractice1.results
  if(data.raceResultsPractice2) return data.raceResultsPractice2.results
  if(data.raceResultsPractice3) return data.raceResultsPractice3.results
  return null
}

const getPracticeDescription = (data) => {
  if(data.raceResultsPractice1) return data.raceResultsPractice1.description
  if(data.raceResultsPractice2) return data.raceResultsPractice2.description
  if(data.raceResultsPractice3) return data.raceResultsPractice3.description
  return ""
}

const getData = async () => {
  const meetingNameSpace = meetingName.replaceAll("-", " ")
  const res = await fetchData(`https://api.jolpi.ca/ergast/f1/${an}.json?limit=100`)
  curse.value = res.MRData.RaceTable.Races

  for (let i = 0; i < curse.value.length; i++) {
    if (meetingNameSpace === curse.value[i].raceName.toLowerCase()) {
      nrCursa.value = i
      break
    }
  }

  const raceRes = await fetchData(`${import.meta.env.VITE_API_LINK}/mongo/race-data/all`)
  sessionKey.value = raceRes[nrCursa.value].fomRaceId

  const runda = await getNext
  nrRundaActuala.value = runda.meetingContext.nr_runda
  const meetingYear = runda.meetingContext.season
  const meetingPath = sessionKey.value + "_" + meetingName
  const base_practice_link = `${import.meta.env.VITE_API_LINK}/api-latest-session-f/view/${meetingYear}/${meetingPath}`

  const linkBase = `https://api.jolpi.ca/ergast/f1/${an}/${nrCursa.value + 1}`
  const terminare = ".json?limit=100"

  const raceData = await fetchData(linkBase + "/results" + terminare)
  const race = raceData.MRData.RaceTable.Races[0]

  const qualiDataRes = await fetchData(linkBase + "/qualifying" + terminare)
  qualiData.value = qualiDataRes.MRData.RaceTable.Races[0]

  if(nrCursa.value > 9){
    let base_data = null
    try {
      base_data = await makeRequest(base_practice_link)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("Practice data not found. Skipping practice sessions.")
      } else {
        console.error("Error fetching practice data:", err)
      }
    }
    if(base_data && base_data.sessions){
      const dataArray = Object.keys(base_data.sessions).map(key => {
        return {
          key,
          ...base_data.sessions[key]
        }
      })
      fpResults.value = dataArray.reverse()
    }
  }

  if (race?.Results) {
    race.Results.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"))
    cursaData.value = race
  }

  if (curse.value[nrCursa.value]?.Sprint) {
    const sprintDataRes = await fetchData(linkBase + "/sprint" + terminare)
    const sprint = sprintDataRes.MRData.RaceTable.Races[0]
    sprint.SprintResults.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"))
    sprintData.value = sprint
  }
}

onMounted(() => {
  getData()
})
useHead({
  title: `GridFanHub | ${meetingNameFormatted.value} ${an} Results`,
  meta: [
    {
      name: "description",
      content: `See all results from the ${meetingNameFormatted.value} ${an} Formula 1 weekend: race, qualifying, sprint and race control messages on GridFanHub.`,
    },
    {
      name: "keywords",
      content: `${meetingNameFormatted.value} ${an} F1, GridFanHub, F1 race control, formula1, f1, finishing order, Formula 1 ${an} ${meetingNameFormatted.value} results, F1 qualifying, F1 sprint results, ${an} F1 race outcome, race control messages, race control`,
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content: `GridFanHub | ${meetingNameFormatted.value} ${an} Results`,
    },
    {
      property: "og:description",
      content: `Catch up on all sessions from ${meetingNameFormatted.value} ${an}. View race, qualifying, and sprint results and race control messages.`,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: `https://gridfanhub.com/schedule/${an}/${meetingNameFormatted.value}`,
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
      content: `GridFanHub | ${meetingNameFormatted.value} ${an} Results`,
    },
    {
      name: "twitter:description",
      content: `Results from ${meetingNameFormatted.value} ${an} — check out qualifying, sprint, race results and race control messages in one place.`,
    },
    {
      name: "twitter:image",
      content: "https://gridfanhub.com/favicon.ico",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: `https://gridfanhub.com/schedule/${an}/${meetingName}`,
    },
  ],
})
</script>


<template>
  <div class="container-curse pt-2 mb-10">
    <div class="text-center mb-12">
      <h1 class="text-6xl lg:text-5xl font-bold tracking-tight source text-black">
        {{ meetingNameFormatted + " results" }}
      </h1>
      <p class="mt-2 text-xl lg:text-lg text-gray-500 ">{{an}} Season</p>
    </div>

    <p v-if="!cursaData && !qualiData && !sprintData && !fpResults" class="titlu-pagina-curse">
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
    <div v-if="fpResults" class="flex flex-col align-center justify-center gap-8 w-full">
      <div v-for="fpResult in fpResults" :key="fpResult.key" class="w-auto lg:mx-auto">
        <PracticeResultsTable
            :results="getPracticeResults(fpResult.data)"
            :session-name="getPracticeDescription(fpResult.data)"
            v-if="getPracticeResults(fpResult.data)"
        />
      </div>
    </div>
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
