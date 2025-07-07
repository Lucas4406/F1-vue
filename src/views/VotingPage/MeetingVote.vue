<template>
  <div class="text-center mb-12">
    <h1 class="text-5xl lg:text-4xl font-extrabold tracking-tight source text-black">
      Formula 1 Race Fan Voting
    </h1>
    <p class="mt-2 text-xl lg:text-lg text-gray-500 ">Who impressed you the most this weekend?</p>
  </div>

  <div v-if="dataLoaded" class="flex flex-col lg:flex-row gap-8 w-4/5 lg:max-w-6xl mx-auto my-8">
    <div class="bg-gray-100  p-4 rounded-xl w-full lg:max-w-4xl mx-auto my-8 shadow-lg racefansgrid" v-if="alreadyVoted && !waitMessage">
      <div class="flex flex-row justify-between items-center mb-6">
        <div class="mb-4 md:mb-0">
          <h1 class="text-4xl lg:text-3xl font-extrabold text-gray-800 source">{{ meetingName }}</h1>
          <h2 class="text-lg lg:text-base text-gray-600 source">{{ meetingDate }}</h2>
        </div>
        <img :src="meetingTrackPhoto" alt="Circuit" class="w-40 rounded-lg shadow-md" />
      </div>

      <div class="text-2xl lg:text-xl font-semibold text-gray-900 mb-4 source">
        You have already voted for this meeting.
      </div>
    </div>
    <div class="bg-gray-100  p-4 rounded-xl w-full lg:max-w-4xl mx-auto my-8 shadow-lg racefansgrid" v-if="waitMessage">
      <div class="flex flex-row justify-between items-center mb-6">
        <div class="mb-4 md:mb-0">
          <h1 class="text-4xl lg:text-3xl font-extrabold text-gray-800 source">{{ waitMessage }}</h1>
        </div>
      </div>
    </div>
    <div v-if="!alreadyVoted && !waitMessage" class="bg-gray-100 p-4 rounded-xl w-full lg:max-w-4xl mx-auto my-8 shadow-lg racefansgrid">
      <div class="flex flex-row justify-between items-center mb-6">
        <div class="mb-4 md:mb-0">
          <h1 class="text-4xl lg:text-3xl font-extrabold text-gray-800 source">{{ meetingName }}</h1>
          <h2 class="text-lg lg:text-base text-gray-600 source">{{ meetingDate }}</h2>
        </div>
        <img :src="meetingTrackPhoto" alt="Circuit" class="w-40 rounded-lg shadow-md" />
      </div>

      <p class="text-xl lg:text-lg text-gray-700 mb-6 italic">Please select one option from each category below to submit your vote.</p>

      <div class="mb-8">
        <h3 class="text-2xl lg:text-xl font-semibold mb-4 text-gray-900 ">🏆 Best Point Scorer</h3>
        <div class="space-y-3">
          <div
              v-for="driver in topTen"
              :key="driver.driverId"
              @click="selectScorer(driver.driverId, driver.teamKey)"
              :class="[
              'flex items-center justify-between rounded-lg p-3 cursor-pointer border',
              selectedScorer && selectedScorer.id === driver.driverId
                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-900 text-blue-100'
                : 'bg-gray-700 text-gray-100',
            ]"
          >
            <div class="flex items-center gap-3 text-xl lg:text-lg">
              <span class="w-6 text-[#fff] font-bold">{{ driver.displayPosition }}</span>
              <img :src="driver.driverImage" alt="Driver" class="w-10 h-10 rounded-full object-cover" />
              <span class="font-medium text-[#fff]">{{ driver.driverFirstName + " " + driver.driverLastName }}</span>
            </div>
            <span class="font-semibold text-xl lg:text-lg text-[#fff]">+{{ driver.racePoints }} pts</span>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-2xl lg:text-xl font-semibold mb-2 text-gray-900 ">⚔️ Best Of The Rest</h3>
        <p class="text-md lg:text-sm text-gray-600 mb-4">
          (Drivers in this category did not score championship points in the last race.)
        </p>
        <div class="space-y-3">
          <div
              v-for="driver in rest"
              :key="driver.driverId"
              @click="selectOvertaker(driver.driverId, driver.teamKey)"
              :class="[
              'flex items-center justify-between rounded-lg p-3 cursor-pointer border',
              selectedOvertaker && selectedOvertaker.id === driver.driverId
                ? 'border-green-500 ring-2 ring-green-500 bg-blue-100 text-green-900'
                : 'bg-white text-gray-900 hover:border-gray-400',
            ]"
          >
            <div class="flex items-center gap-3 text-xl lg:text-lg">
              <span class="w-6 text-gray-500 font-bold">{{ driver.displayPosition }}</span>
              <img :src="driver.driverImage" alt="Driver" class="w-10 h-10 rounded-full object-cover" />
              <span class="font-medium text-gray-900 ">{{ driver.driverFirstName + " " + driver.driverLastName }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-2xl lg:text-xl font-semibold mb-4 text-gray-900 ">🏆 Best Team</h3>
        <div class="space-y-3">
          <div
              v-for="team in teams"
              :key="team.teamKey"
              @click="selectTeam(team.teamKey)"
              :class="[
              'flex items-center justify-between rounded-lg p-3 cursor-pointer border',
              selectedTeam === team.teamKey
                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-900 text-blue-100'
                : 'bg-gray-700 text-gray-100',
            ]"
          >
            <div class="flex items-center gap-3 text-xl lg:text-lg">
              <span class="w-6 text-[#fff] font-bold">{{ team.teamPosition }}</span>
              <img :src="team.teamLogo" alt="Team" class="w-10 h-10 rounded-full object-cover" />
              <span class="font-medium text-[#fff]">{{ team.teamName }}</span>
            </div>
            <span class="font-semibold text-xl lg:text-lg text-[#fff]">{{ team.teamPoints }} pts</span>
          </div>
        </div>
      </div>

      <button
          @click="submitVote"
          :disabled="!canSubmit || isSubmitting"
          class="text-2xl lg:text-lg w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Vote
      </button>
      <p v-if="!canSubmit" class="text-xl lg:text-base text-red-600 mt-2">Each category must be selected.</p>
    </div>

    <div class="bg-gray-100 p-4 rounded-xl w-full lg:max-w-4xl mx-auto my-8 shadow-lg racefansgrid" v-if="!waitMessage">
      <div class="my-4 space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">🏁 Top 3 Best Point Scorers</h3>
          <DriverChart :drivers="topTenChart" />
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900">⚔️ Top 3 Best Of The Rest</h3>
          <DriverChart :drivers="restChart" />
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900">🏆 Top 3 Teams</h3>
          <TeamChart :teams="teamChart" />
        </div>
      </div>

      <div class="text-center mt-8">
        <router-link to="/vote/results">
          <ReusableButton >
            View All Results
          </ReusableButton>
        </router-link>
      </div>
    </div>
  </div>

  <div class="flex justify-center items-center mt-8" v-if="!dataLoaded">
    <ProgressSpinner />
  </div>
</template>



<script setup>
import {ref, computed, onMounted, inject} from 'vue'
import { DateTime } from 'luxon'
import {useHead} from "@vueuse/head";
import DriverChart from "@/components/DriverChart.vue";
import TeamChart from "@/components/TeamChart.vue";
import ReusableButton from "@/components/ReusableButton.vue";


import {makeRequest} from "@/functions/makeRequest";
import axios from "axios";

const meetingName = ref(null)
const meetingDate = ref(null)
const topTen = ref([])
const rest = ref([])
const teams = ref([])
const meetingTrackPhoto = ref(null)
const selectedScorer = ref(null)
const selectedOvertaker = ref(null)
const selectedTeam = ref(null)
const alreadyVoted = ref(false) // To track if the user has already voted
const dataLoaded = ref(false)
const meetingId = ref(null)
const isSubmitting = ref(false)
const waitMessage = ref(null)

const store = inject("store")



async function getRelevantData() {
  try {
    const lastMeeting = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`);
    const lastMeetingID = lastMeeting.fomRaceId;
    meetingId.value = lastMeetingID;

    const meetingYear = lastMeeting.meetingContext.season;
    const meetingData = await makeRequest(`${import.meta.env.VITE_API_LINK}/vote/get-meeting-data/${meetingYear}/${lastMeetingID}`);

    meetingName.value = meetingData.raceResults.meeting.meetingName;

    const startTimeISO = meetingData.raceResults.raceResultsRace.startTime; // ex: "2025-06-15T14:00:00"
    const gmtOffset = meetingData.raceResults.raceResultsRace.gmtOffset || "+00:00"; // ex: "-04:00"
    const isoWithOffset = `${startTimeISO}${gmtOffset}`;
    const dt = DateTime.fromISO(isoWithOffset);
    meetingDate.value = dt.setZone('local').toLocaleString(DateTime.DATETIME_MED);

    const resultsArray = meetingData.raceResults.raceResultsRace.results;
    topTen.value = resultsArray.slice(0, 10);      // primii 10
    rest.value = resultsArray.slice(10);
    teams.value = meetingData.teamsData;
    meetingTrackPhoto.value = meetingData.meetingData.circuitMediumImage.url;

  } catch (error) {
    console.error("Error fetching meeting data:", error);
    waitMessage.value = "Voting is currently unavailable. Please check back after the race has ended.";
  }
}

onMounted(async () => {
  await getRelevantData()
  if(meetingId.value) {
    await getVoteResults(meetingId.value)
  }
  if(!waitMessage.value){
    const isLoggedIn = store?.user?.profileId
    let localVisitorId = localStorage.getItem('visitorId')

    if (!isLoggedIn) {
      if (!localVisitorId) {
        localVisitorId = crypto.randomUUID()
        localStorage.setItem('visitorId', localVisitorId)
      }
    }

    alreadyVoted.value = await checkHasVoted(store?.user?.profileId, localVisitorId, meetingId.value)
  }
  dataLoaded.value = true

})


const topTenChart = ref([]);
const restChart = ref([]);
const teamChart = ref([]);

async function getVoteResults(meeting_key) {
  try {
    const results = await makeRequest(`${import.meta.env.VITE_API_LINK}/vote/results/${meeting_key}`)
    topTenChart.value = results.topTenDrivers.slice(0,3)
    restChart.value = results.topBestOfTheRestDrivers.slice(0,3)
    teamChart.value = results.topBestTeam.slice(0,3)
  } catch (error) {
    console.error("Error fetching vote results:", error);
  }
}




function selectScorer(id , teamKey) {
  selectedScorer.value = {
    id: id,
    teamKey: teamKey
  }
}
function selectOvertaker(id, teamKey) {
  selectedOvertaker.value = {
    id: id,
    teamKey: teamKey
  }
}

function selectTeam(id) {
  selectedTeam.value = id
}


function saveVoteToLocal(meetingName, meetingId) {
  let voted = localStorage.getItem("meetings_voted");
  let votedObj = {};

  if (voted) {
    try {
      votedObj = JSON.parse(voted);
    } catch (e) {
      votedObj = {};
    }
  }

  votedObj[meetingName] = meetingId;
  localStorage.setItem("meetings_voted", JSON.stringify(votedObj));
}


async function checkHasVoted(userId, visitorId, meetingId) {
  const meetingsVotedRaw = localStorage.getItem('meetings_voted')
  const meetingsVoted = meetingsVotedRaw ? JSON.parse(meetingsVotedRaw) : {}
  const alreadyVotedLocally = Object.values(meetingsVoted).includes(meetingId)

  if (alreadyVotedLocally) return true

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_LINK}/vote/check-vote`, {
      meetingKey: meetingId,
      userId: userId || undefined,
      visitorId: userId ? undefined : visitorId, // folosește doar dacă nu e logat
    }, {
      headers: {
        'x-api-key': import.meta.env.VITE_VOTE_API_KEY
      }
    })
    return response.data.hasVoted === true
  } catch (error) {
    console.error('Error checking vote status:', error)
    return false
  }
}

const canSubmit = computed(() =>
    selectedScorer.value &&
    selectedOvertaker.value &&
    selectedTeam.value
)

async function submitVote() {
  if (!canSubmit.value) {
    alert("Please make all selections before submitting your vote.");
    return;
  }

  if (isSubmitting.value) return; // dacă e deja în curs, nu face nimic

  isSubmitting.value = true;

  try {
    const scorer = selectedScorer.value;
    const bestoftherest = selectedOvertaker.value;
    const team = selectedTeam.value;
    const meeting_id = meetingId.value;
    const votingUrl = `${import.meta.env.VITE_API_LINK}/vote`;
    const userID = store?.user?.profileId || null;
    const visitor = localStorage.getItem('visitorId') || null;

    const payload = {
      userId: userID,
      visitorId: userID ? null : visitor,
      meetingKey: meeting_id,
      bestTopTenDriverId: String(scorer.id),
      bestTopTenTeamKey: scorer.teamKey,
      bestOfTheRestDriverId: String(bestoftherest.id),
      bestOfTheRestTeamKey: bestoftherest.teamKey,
      bestTeamKey: team,
    };

    const response = await axios.post(votingUrl, payload, {
      headers: {
        'x-api-key': import.meta.env.VITE_VOTE_API_KEY
      }
    });

    if (response.status === 200) {
      saveVoteToLocal(meetingName.value, meetingId.value);
      alreadyVoted.value = true;
      alert(`Vote submitted successfully for ${meetingName.value}!`);

      await getVoteResults(meetingId.value)
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (error) {
    if (error.response && error.response.data?.error === "Already voted.") {
      alert("You have already voted for this meeting.");
      alreadyVoted.value = true;
    } else if (error.response?.data?.errors) {
      const validationErrors = error.response.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
      alert("Validation error:\n" + validationErrors);
    } else {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while submitting your vote.");
    }
  } finally {
    isSubmitting.value = false;
  }
}

const pageMeetingName = computed(() => {
  return meetingName.value || "Latest Race"; // Default to "Latest Race" if still null
});

useHead({
  title: computed(() => `GridFanHub | ${pageMeetingName.value} | Vote for F1 Best of the Weekend`),
  meta: [
    {
      name: "description",
      content: computed(() => `${pageMeetingName.value}: Vote for the Best Point Scorer, Best of the Rest, and Best Team from the latest Formula 1 Grand Prix weekend on GridFanHub. Share your opinion and see what other fans think!`),
    },
    {
      name: "keywords",
      content: computed(() => `${pageMeetingName.value}, F1 vote, Formula 1 voting, F1 best driver, F1 best team, F1 best of the rest, vote F1 drivers, vote F1 teams, Formula 1 fan vote, F1 driver of the day, F1 top 10 vote, gridfanhub vote, gridfanhub, f1, formula1, best point scorer, best team, best of the rest, f1 2025 voting, f1 fans vote`),
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content: computed(() => `GridFanHub | ${pageMeetingName.value} | Vote for F1 Best of the Weekend`),
    },
    {
      property: "og:description",
      content: computed(() => `Who impressed you the most in the ${pageMeetingName.value}? Vote now for the Best Point Scorer, Best of the Rest, and Best Team of the weekend on GridFanHub.`),
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://gridfanhub.com/vote",
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
      content: computed(() => `GridFanHub | ${pageMeetingName.value} | Vote for F1 Best of the Weekend`),
    },
    {
      name: "twitter:description",
      content: computed(() => `Who impressed you the most in the ${pageMeetingName.value}? Vote now for the Best Point Scorer, Best of the Rest, and Best Team of the weekend on GridFanHub.`),
    },
    {
      name: "twitter:image",
      content: "https://gridfanhub.com/favicon.ico", // modifică cu imaginea reală
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://gridfanhub.com/vote",
    },
  ],
})


</script>
