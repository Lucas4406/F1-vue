<template>
  <div class="text-center mb-12">
    <h1 class="text-5xl lg:text-4xl font-extrabold tracking-tight source text-black">
      Formula 1 Race Fan Voting
    </h1>
  </div>
  <div class="bg-gray-100  p-4 rounded-xl w-4/5 lg:max-w-4xl mx-auto my-8 shadow-lg">
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
          <span class="font-semibold text-xl lg:text-lg text-[#fff]">{{ driver.racePoints }} pts</span>
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

    <!-- Submit button -->
    <button
        @click="submitVote"
        class="text-lg lg:text-base w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        :disabled="!canSubmit"
    >
      Submit Vote
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch  } from 'vue'
import { DateTime } from 'luxon'

import { useRoute } from 'vue-router'
import {makeRequest} from "@/functions/makeRequest";

const meetingName = ref(null)
const meetingDate = ref(null)
const topTen = ref([])
const rest = ref([])
const meetingTrackPhoto = ref(null)
const visitorId = ref(null)

const route = useRoute()
const an = route.params.an
visitorId.value = crypto.randomUUID()


async function getRelevantData() {
  const lastMeeting = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`)
  const lastMeetingID = lastMeeting.fomRaceId
  const meetingData = await makeRequest(`${import.meta.env.VITE_API_LINK}/vote/get-meeting-data/${an}/${lastMeetingID}`)
  meetingName.value = meetingData.raceResults.meeting.meetingName
  const startTimeISO = meetingData.raceResults.raceResultsRace.startTime // ex: "2025-06-15T14:00:00"
  const gmtOffset = meetingData.raceResults.raceResultsRace.gmtOffset || "+00:00" // ex: "-04:00"
  let dt = DateTime.fromISO(startTimeISO, { zone: 'utc' })
  dt = dt.setZone(`UTC${gmtOffset}`)
  meetingDate.value = dt.setZone('local').toLocaleString(DateTime.DATETIME_FULL)
  const resultsArray = meetingData.raceResults.raceResultsRace.results
  topTen.value = resultsArray.slice(0, 10)      // primii 10
  rest.value = resultsArray.slice(10)
  meetingTrackPhoto.value = meetingData.meetingData.circuitMediumImage.url
}

onMounted(async() => {
  await getRelevantData()
})

const selectedScorer = ref(null)
const selectedOvertaker = ref(null)

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
watch(selectedScorer, (newVal) => {
  console.log(newVal, visitorId.value)
})
watch(selectedOvertaker, (newVal) => {
  console.log(newVal)
})
const canSubmit = computed(() => selectedScorer.value && selectedOvertaker.value)

function submitVote() {
  alert(`Votat:
  🏆 Scorer: ${selectedScorer.id}
  ⚔️ Best Of The Rest: ${selectedOvertaker.id}`)
}
</script>
