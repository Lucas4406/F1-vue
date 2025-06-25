<template>
  <div class="text-center mb-12">
    <h1 class="text-5xl lg:text-4xl font-extrabold tracking-tight source text-black">
      Formula 1 Race Fan Voting
    </h1>
    <p class="mt-2 text-xl lg:text-lg text-gray-500 ">Who impressed you the most this weekend?</p>
  </div>
  <div class="bg-gray-100  p-4 rounded-xl w-4/5 lg:max-w-4xl mx-auto my-8 shadow-lg" v-if="!alreadyVoted && dataLoaded">
    <!-- Header -->
    <div class="flex flex-row justify-between items-center mb-6">
      <div class="mb-4 md:mb-0">
        <h1 class="text-4xl lg:text-3xl font-extrabold text-gray-800 ">{{ meetingName }}</h1>
        <h2 class="text-lg lg:text-base text-gray-600 ">{{ meetingDate }}</h2>
      </div>
      <img :src="meetingTrackPhoto" alt="Circuit" class="w-40 rounded-lg shadow-md" />
    </div>

    <!-- Top Point Scorer -->
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

    <!-- Best Overtaker -->
    <div class="mb-8">
      <h3 class="text-2xl lg:text-xl font-semibold mb-4 text-gray-900 ">⚔️ Best Of The Rest</h3>
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
<!--    Best Team-->
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
            <img :src="team.teamLogo" alt="Driver" class="w-10 h-10 rounded-full object-cover" />
            <span class="font-medium text-[#fff]">{{ team.teamName }}</span>
          </div>
          <span class="font-semibold text-xl lg:text-lg text-[#fff]">{{ team.teamPoints }} pts</span>
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <button
        @click="submitVote"
        class="text-2xl lg:text-lg w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
        :class="{'opacity-50 cursor-not-allowed': !canSubmit}"
    >
      Submit Vote
    </button>
    <p v-if="!canSubmit" class="text-xl lg:text-base text-red-600 mt-2">Each category must be selected.</p>
  </div>
  <div class="bg-gray-100  p-4 rounded-xl w-4/5 lg:max-w-4xl mx-auto my-8 shadow-lg" v-if="alreadyVoted && dataLoaded">
    <!-- Header -->
    <div class="flex flex-row justify-between items-center mb-6">
      <div class="mb-4 md:mb-0">
        <h1 class="text-4xl lg:text-3xl font-extrabold text-gray-800 ">{{ meetingName }}</h1>
        <h2 class="text-lg lg:text-base text-gray-600 ">{{ meetingDate }}</h2>
      </div>
      <img :src="meetingTrackPhoto" alt="Circuit" class="w-40 rounded-lg shadow-md" />
    </div>

    <div class="text-2xl lg:text-xl font-semibold text-gray-900 mb-4">
      You have already voted for this meeting.
    </div>
  </div>

  <div class="flex justify-center items-center mt-8" v-if="!dataLoaded">
    <ProgressSpinner />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, inject} from 'vue'
import { DateTime } from 'luxon'

import { useRoute } from 'vue-router'
import {makeRequest} from "@/functions/makeRequest";
import axios from "axios";

const meetingName = ref(null)
const meetingDate = ref(null)
const topTen = ref([])
const rest = ref([])
const teams = ref([])
const meetingTrackPhoto = ref(null)
const visitorId = ref(null)
const selectedScorer = ref(null)
const selectedOvertaker = ref(null)
const selectedTeam = ref(null)
const alreadyVoted = ref(false) // To track if the user has already voted
const dataLoaded = ref(false)
const meetingId = ref(null)

const route = useRoute()
const an = route.params.an
const store = inject("store")



async function getRelevantData() {
  const lastMeeting = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`)
  const lastMeetingID = lastMeeting.fomRaceId
  meetingId.value = lastMeetingID
  const meetingData = await makeRequest(`${import.meta.env.VITE_API_LINK}/vote/get-meeting-data/${an}/${lastMeetingID}`)
  meetingName.value = meetingData.raceResults.meeting.meetingName
  const startTimeISO = meetingData.raceResults.raceResultsRace.startTime // ex: "2025-06-15T14:00:00"
  const gmtOffset = meetingData.raceResults.raceResultsRace.gmtOffset || "+00:00" // ex: "-04:00"
  const isoWithOffset = `${startTimeISO}${gmtOffset}`
  const dt = DateTime.fromISO(isoWithOffset)
  meetingDate.value = dt.setZone('local').toLocaleString(DateTime.DATETIME_MED)
  const resultsArray = meetingData.raceResults.raceResultsRace.results
  topTen.value = resultsArray.slice(0, 10)      // primii 10
  rest.value = resultsArray.slice(10)
  teams.value = meetingData.teamsData
  meetingTrackPhoto.value = meetingData.meetingData.circuitMediumImage.url
}

onMounted(async () => {
  await getRelevantData()

  const isLoggedIn = store?.user?.profileId
  let localVisitorId = localStorage.getItem('visitorId')

  if (!isLoggedIn) {
    if (!localVisitorId) {
      localVisitorId = crypto.randomUUID()
      localStorage.setItem('visitorId', localVisitorId)
    }
  }

  alreadyVoted.value = await checkHasVoted(store?.user?.profileId, localVisitorId, meetingId.value)
  dataLoaded.value = true
})




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
watch(selectedScorer, (newVal) => {
  console.log(newVal, visitorId.value)
})
watch(selectedOvertaker, (newVal) => {
  console.log(newVal)
})



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
  const scorer = selectedScorer.value
  const bestoftherest = selectedOvertaker.value
  const team = selectedTeam.value
  const meeting_id = meetingId.value
  const votingUrl = `${import.meta.env.VITE_API_LINK}/vote`
  const userID = store?.user?.profileId || null
  const visitor = localStorage.getItem('visitorId') || null

  if (!canSubmit.value) {
    alert("Please make all selections before submitting your vote.")
    return
  }

  const payload = {
    userId: userID,                         // poate fi null
    visitorId: userID ? null : visitor,     // trimite doar dacă nu e logat
    meetingKey: meeting_id,
    bestTopTenDriverId: String(scorer.id),
    bestTopTenTeamKey: scorer.teamKey,
    bestOfTheRestDriverId: String(bestoftherest.id),
    bestOfTheRestTeamKey: bestoftherest.teamKey,
    bestTeamKey: team,
  }

  try {
    const response = await axios.post(votingUrl, payload, {
      headers: {
        'x-api-key': import.meta.env.VITE_VOTE_API_KEY
      }
    })

    if (response.status === 200) {
      saveVoteToLocal(meetingName.value, meetingId.value)
      alreadyVoted.value = true

      alert(`Vote submitted successfully for ${meetingName.value}!`)
    } else {
      alert("Something went wrong. Please try again.")
    }
  } catch (error) {
    if (error.response && error.response.data?.error === "Already voted.") {
      alert("You have already voted for this meeting.")
      alreadyVoted.value = true
    } else if (error.response?.data?.errors) {
      const validationErrors = error.response.data.errors.map(e => `${e.field}: ${e.message}`).join('\n')
      alert("Validation error:\n" + validationErrors)
    } else {
      console.error("Unexpected error:", error)
      alert("An unexpected error occurred while submitting your vote.")
    }
  }
}

</script>
