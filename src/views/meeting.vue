<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import tabelcursa from "@/components/tabelcursa.vue"
import tabelcali from "@/components/tabelcali.vue"
import Tabelsprint from "@/components/tabelsprint.vue"
import PracticeResultsTable from "@/components/PracticeResultsTable.vue"
import QualifyingResultsTable from "@/components/QualifyingResultsTable.vue"
import RaceResultsTable from "@/components/RaceResultsTable.vue"
// import AccordionMesaje from "@/components/AccordionMesaje.vue"
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
const qualiData = ref(null) // This remains for the Ergast fallback
const sessionKey = ref(null)
const nrRundaActuala = ref(null)
const fpResults = ref([])

const formatMeetingName = (slug) =>
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const meetingNameFormatted = computed(() => formatMeetingName(meetingName))

const hasModernQualiData = computed(() => {
  if (!fpResults.value || fpResults.value.length === 0) {
    return false;
  }
  // Check if any session object contains results for Qualifying or Sprint Shootout
  return fpResults.value.some(session =>
      session.data.raceResultsQualifying || session.data.raceResultsSprintShootout
  );
});

const hasModernRaceData = computed(() => {
  if (!fpResults.value || fpResults.value.length === 0) {
    return false;
  }
  // Check if any session object contains results for Race or Sprint
  return fpResults.value.some(session =>
      session.data.raceResultsRace || session.data.raceResultsSprint
  );
});

const hasModernSprintData = computed(() => {
  if (!fpResults.value || fpResults.value.length === 0) return false;
  return fpResults.value.some(session => session.data.raceResultsSprint);
});


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

const getPracticeSessionInfo = (data) => {
  if(data.raceResultsPractice1) return data.raceResultsPractice1;
  if(data.raceResultsPractice2) return data.raceResultsPractice2;
  if(data.raceResultsPractice3) return data.raceResultsPractice3;
  return {}; // Return an empty object as a fallback
}

const getData = async () => {
  const meetingNameSpace = meetingName.replaceAll("-", " ");
  const res = await makeRequest(`https://api.jolpi.ca/ergast/f1/${an}.json?limit=100`);
  curse.value = res.MRData.RaceTable.Races;

  for (let i = 0; i < curse.value.length; i++) {
    if (meetingNameSpace === curse.value[i].raceName.toLowerCase()) {
      nrCursa.value = i;
      break;
    }
  }

  const raceRes = await makeRequest(`${import.meta.env.VITE_API_LINK}/mongo/race-data/all`);
  sessionKey.value = raceRes[nrCursa.value].fomRaceId;

  const runda = await getNext;
  nrRundaActuala.value = runda.meetingContext.nr_runda;
  const meetingYear = runda.meetingContext.season;
  const meetingPath = sessionKey.value + "_" + meetingName;
  const base_practice_link = `${import.meta.env.VITE_API_LINK}/api-latest-session-f/view/${meetingYear}/${meetingPath}`;

  const linkBase = `https://api.jolpi.ca/ergast/f1/${an}/${nrCursa.value + 1}`;
  const terminare = ".json?limit=100";

  if (nrCursa.value > 9) {
    let base_data = null;
    try {
      base_data = await makeRequest(base_practice_link);
      if (base_data && base_data.sessions) {
        const dataArray = Object.keys(base_data.sessions).map(key => ({
          key,
          ...base_data.sessions[key]
        }));
        fpResults.value = dataArray.reverse();
      }
    } catch (err) {
      console.error("Could not fetch modern session data. Will try Ergast fallbacks.", err);
    }
  }

  // Fallback for Race results
  if (!hasModernRaceData.value) {
    console.log("Modern race data not found, fetching fallback from Ergast...");
    try {
      const raceDataRes = await makeRequest(linkBase + "/results" + terminare);
      const race = raceDataRes.MRData.RaceTable.Races[0];
      if (race?.Results) {
        race.Results.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"));
        cursaData.value = race;
      }
    } catch (e) {
      console.log("Could not fetch fallback race data either.");
    }
  } else {
    console.log("Modern race data found, skipping Ergast API call for race.");
  }

  // Fallback for Qualifying results
  if (!hasModernQualiData.value) {
    console.log("Modern quali data not found, fetching fallback from Ergast...");
    try {
      const qualiDataRes = await makeRequest(linkBase + "/qualifying" + terminare);
      qualiData.value = qualiDataRes.MRData.RaceTable.Races[0];
    } catch (e) {
      console.log("Could not fetch fallback qualifying data either.");
    }
  } else {
    console.log("Modern quali data found, skipping Ergast API call for qualifying.");
  }

  // Fallback for Sprint results (only if the event has a sprint)
  if (curse.value[nrCursa.value]?.Sprint && !hasModernSprintData.value) {
    console.log("Modern sprint data not found, fetching fallback from Ergast...");
    try {
      const sprintDataRes = await makeRequest(linkBase + "/sprint" + terminare);
      const sprint = sprintDataRes.MRData.RaceTable.Races[0];
      sprint.SprintResults.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"));
      sprintData.value = sprint;
    } catch(e) {
      console.log("Could not fetch fallback sprint data either.");
    }
  } else if (hasModernSprintData.value) {
    console.log("Modern sprint data found, skipping Ergast API call for sprint.");
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

    <p v-if="!cursaData && !qualiData && !sprintData && !fpResults.length" class="titlu-pagina-curse">
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

    <div v-if="fpResults.length" class="flex flex-col align-center justify-center gap-8 w-full">
      <div v-for="fpResult in fpResults" :key="fpResult.key" class="w-auto lg:min-w-[60%] lg:mx-auto">

        <RaceResultsTable
            v-if="fpResult.data.raceResultsRace"
            :results="fpResult.data.raceResultsRace.results"
            :session-name="fpResult.data.raceResultsRace.description"
            :session-info="fpResult.data.raceResultsRace"
        />

        <RaceResultsTable
            v-else-if="fpResult.data.raceResultsSprint"
            :results="fpResult.data.raceResultsSprint.results"
            :session-name="fpResult.data.raceResultsSprint.description"
            :session-info="fpResult.data.raceResultsSprint"
        />

        <QualifyingResultsTable
            v-else-if="fpResult.data.raceResultsQualifying"
            :results="fpResult.data.raceResultsQualifying.results"
            :session-name="fpResult.data.raceResultsQualifying.description"
            :session-info="fpResult.data.raceResultsQualifying"
        />

        <QualifyingResultsTable
            v-else-if="fpResult.data.raceResultsSprintShootout"
            :results="fpResult.data.raceResultsSprintShootout.results"
            :session-name="fpResult.data.raceResultsSprintShootout.description"
            :session-info="fpResult.data.raceResultsSprintShootout"
        />

        <PracticeResultsTable
            v-else-if="getPracticeResults(fpResult.data)"
            :results="getPracticeResults(fpResult.data)"
            :session-name="getPracticeDescription(fpResult.data)"
            :session-info="getPracticeSessionInfo(fpResult.data)"
        />

      </div>
    </div>

  </div>
</template>

<style scoped>
@import "../assets/curse.css";
</style>
