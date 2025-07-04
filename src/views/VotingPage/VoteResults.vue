<template>
  <div class="text-center mb-12">
    <h1 class="text-5xl lg:text-4xl font-extrabold tracking-tight source text-black">
      Formula 1 Weekend Full Results
    </h1>
    <p class="mt-2 text-xl lg:text-lg text-gray-500 ">
      Full fan voting results for Best Point Scorer, Best Of The Rest, and Best Team.
    </p>
  </div>

  <!-- Loading spinner -->
  <div class="flex justify-center items-center mt-8" v-if="!dataLoaded && !waitMessage">
    <ProgressSpinner />
  </div>

  <!-- Wait message -->
  <div v-if="waitMessage" class="text-center bg-gray-100  p-4 rounded-xl w-4/5 lg:max-w-4xl mx-auto my-8 shadow-lg racefansgrid">
    <p class="text-4xl lg:text-3xl font-extrabold text-gray-800 source">{{ waitMessage }}</p>
  </div>

  <!-- Results -->
  <div v-else-if="dataLoaded" class="flex flex-col gap-12 w-4/5 lg:max-w-6xl mx-auto my-8 program-hero rounded-xl p-6">

    <!-- Best Point Scorer -->
    <div>
      <h2 class="text-3xl font-bold mb-6 text-gray-800 source">🏆 Best Point Scorers</h2>
      <DriverChart :drivers="topTenResults" />
    </div>

    <!-- Best Of The Rest -->
    <div>
      <h2 class="text-3xl font-bold mb-6 text-gray-800 source">⚔️ Best Of The Rest</h2>
      <DriverChart :drivers="restResults" />
    </div>

    <!-- Best Team -->
    <div>
      <h2 class="text-3xl font-bold mb-6 text-gray-800 source">🏆 Best Teams</h2>
      <TeamChart :teams="teamResults" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { makeRequest } from "@/functions/makeRequest";
import DriverChart from "@/components/DriverChart.vue";
import TeamChart from "@/components/TeamChart.vue";
import {useHead} from "@vueuse/head";

const dataLoaded = ref(false)
const topTenResults = ref([])
const restResults = ref([])
const teamResults = ref([])
const waitMessage = ref(null);

async function getResults() {
  try {
    const lastMeeting = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`);
    const lastMeetingID = lastMeeting.fomRaceId;
    // const lastMeetingID = "1264";

    const results = await makeRequest(`${import.meta.env.VITE_API_LINK}/vote/results/${lastMeetingID}`)
    topTenResults.value = results.topTenDrivers || []
    restResults.value = results.topBestOfTheRestDrivers || []
    teamResults.value = results.topBestTeam || []

  } catch (error) {
    console.error("Error fetching results:", error);
    waitMessage.value = "Voting is currently unavailable. Please check back after the race has ended.";
  } finally {
    dataLoaded.value = true
  }
}

onMounted(() => {
  getResults()
})
useHead({
  title: `GridFanHub | Full Results from Last F1 Weekend Fan Voting`,
  meta: [
    {
      name: "description",
      content:
          `See the full Formula 1 fan voting results from the last Grand Prix weekend on GridFanHub. Discover who fans voted as Best Point Scorer, Best Of The Rest, and Best Team.`,
    },
    {
      name: "keywords",
      content:
          `F1 fan voting results, Formula 1 voting results, last F1 weekend results, F1 best driver votes, F1 best team votes, F1 best of the rest votes, F1 2025 fan results, Formula 1 fan results, GridFanHub voting results, F1 fan poll results
`,
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content: `GridFanHub | Full Results from Last F1 Weekend Fan Voting`,
    },
    {
      property: "og:description",
      content:
          `See the full Formula 1 fan voting results from the last Grand Prix weekend on GridFanHub. Discover who fans voted as Best Point Scorer, Best Of The Rest, and Best Team.`,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://gridfanhub.com/vote/results",
    },
    {
      property: "og:image",
      content: "https://gridfanhub.com/favicon.ico", // modifică cu imaginea OG reală
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: `GridFanHub | Full Results from Last F1 Weekend Fan Voting`,
    },
    {
      name: "twitter:description",
      content:
          `See the full Formula 1 fan voting results from the last Grand Prix weekend on GridFanHub. Discover who fans voted as Best Point Scorer, Best Of The Rest, and Best Team.`,
    },
    {
      name: "twitter:image",
      content: "https://gridfanhub.com/favicon.ico", // modifică cu imaginea reală
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://gridfanhub.com/vote/results",
    },
  ],
})
</script>
