<script>
import getNext from "@/functions/getNext.js"
import ConstructorCard from "@/components/ConstructorCard.vue";
import PilotCard from "@/components/PilotCard.vue";
import herocursa from "@/components/herocursa.vue";
import {makeRequest} from "@/functions/makeRequest";
import Stiricomp from "@/components/stiricomp.vue";
import {useHead} from "@vueuse/head";
import AccountCard from "@/components/AccountCard.vue";
import ReusablePodium from "@/components/ReusablePodium.vue";
import ReusableButton from "@/components/ReusableButton.vue";

export default {
  name: "Home",
  components: {
    ReusableButton,
    ReusablePodium,
    AccountCard,
    Stiricomp,
    herocursa,
    PilotCard,
    ConstructorCard,
  },
  inject: ["store"],
  data() {
    return {
      darkMode: null,
      heroData: null,
      Hero: false,
      heroError: false,
      componentKey: 0,
      favouriteTeam: [],
      favDriv: [],
      bla: false,
      driverOk: false,
      modelValue: false,
      smallText: "",
      linkCursa: null,
      lastRaceData: null,      // pentru cursa trecută
      showLastData: false,
      top3Drivers: [],
      top3Teams: [],
      top5Overtakers: [],
      lastRaceDateText: null,
      linkCursaVeche: null,
      showAllPodiums: false,
      voteResultsPreview: null,
      showVotePreview: false,
    }
  },
  async mounted() {
    this.darkMode = localStorage.getItem("darkMode")
    useHead({
      title: "GridFanHub | Up-to-Date Formula 1 News & Insights",
      meta: [
        { name: "keywords", content: "Formula 1, F1, F1 news, F1 standings, Formula 1 calendar, F1 teams, F1 drivers, race results, F1 qualifying, F1 history, Formula 1 reaction game, Formula 1 Romania, F1 RO, formula1 ro, formula1 romania, F1 schedule, gridfanhub f1, GridFanHub, formula1, formula 1, formula 1 aggregated news, f1 race control, race control messages, fia messages rezultate formula 1, rezultate ultima cursa f1, last race results" },
        { name: "description", content: "GridFanHub is your complete source of information about Formula 1: updated and aggregated news, last race results, race schedules, live results, race control messages and standings for drivers and teams. Discover qualifying and race data, play a reaction game for F1 fans, and explore the fascinating history of this sport. All in one place, in English." },
        { name: "author", content: "GridFanHub" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },

        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://gridfanhub.com" },
        { property: "og:title", content: "GridFanHub | Up-to-Date Formula 1 News & Insights" },
        { property: "og:description", content: "GridFanHub is your complete source of information about Formula 1" },
        { property: "og:image", content: "https://gridfanhub.com/favicon.ico" },

        // Twitter
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://gridfanhub.com" },
        { property: "twitter:title", content: "GridFanHub | Up-to-Date Formula 1 News & Insights" },
        { property: "twitter:description", content: "GridFanHub is your complete source of information about Formula 1" },
        { property: "twitter:image", content: "https://gridfanhub.com/favicon.ico" },
      ],
      link: [
        { rel: "canonical", href: "https://gridfanhub.com" }
      ]
    })
    await this.getCursa()
    await this.checkIfShouldLoadLastRace()
  },

  watch: {
    'store.user': {
      immediate: true,
      handler: async function (newUser) {
        if (newUser) {
          if (newUser.favTeam) {
            await this.favoriteTeam()
            this.bla = true
          }
          if (newUser.favDriver) {
            await this.getFavDriver()
            this.driverOk = true
          }
        }
      }
    }
  },


  methods: {
    async getCursa() {
      try {
        const date = await getNext
        const dataInc = new Date(date.race.meetingStartDate)
        const dataSf = new Date(date.race.meetingEndDate)
        let dataI = dataInc.getDate()
        let dataS = dataSf.getDate()
        function padWithLeadingZeros(num, totalLength) {
          return String(num).padStart(totalLength, "0")
        }
        let dataInceput = ""
        let dataSfarsit = ""
        if (dataI < 10) {
          dataInceput = padWithLeadingZeros(dataI, 2)
        } else {
          dataInceput = dataI
        }
        if (dataS < 10) {
          dataSfarsit = padWithLeadingZeros(dataS, 2)
        } else {
          dataSfarsit = dataS
        }
        const monthName = dataInc.toLocaleString('en-GB', { month: 'short' })
        date["inceput"] = dataInceput
        date["sfarsit"] = dataSfarsit
        date["lunaCursaText"] = monthName
        const roundNum = date.meetingContext.nr_runda
        const dataApi = await makeRequest(`https://api.jolpi.ca/ergast/f1/${date.meetingContext.season}.json?limit=100`)
        const rundaActuala = dataApi.MRData.RaceTable.Races[roundNum]
        const rundaLink = rundaActuala.raceName.replace(/\s+/g, '-').toLowerCase();
        this.linkCursa = `/schedule/${date.meetingContext.season}/${rundaLink}`
        this.heroData = date
        this.Hero = true
      } catch (error) {
        console.log(error)
      }
    },
    async getVoteResultsPreview() {
      try {
        // We only need the latest meeting ID, which we already get in checkIfShouldLoadLastRace
        const lastMeetingId = this.lastRaceData.fomRaceId;
        if (!lastMeetingId) return;

        const results = await makeRequest(`${import.meta.env.VITE_API_LINK}/vote/results/${lastMeetingId}`);

        // We only need the number 1 for each category for a preview
        this.voteResultsPreview = {
          topScorer: results.topTenDrivers[0],
          topRest: results.topBestOfTheRestDrivers[0],
          topTeam: results.topBestTeam[0],
        };
        this.showVotePreview = true;
      } catch (error) {
        console.error("Could not fetch vote results preview:", error);
        this.showVotePreview = false;
      }
    },
    async favoriteTeam() {
      const fav = this.store.user.favTeam
      const date = await makeRequest(`${import.meta.env.VITE_API_LINK}/mongo/teams/all`)
      for (let i = 0; i < date.length; i++) {
        if (date[i].name === fav) {
          this.favouriteTeam = date[i]
        }
      }
    },
    async getFavDriver() {
      const resp = await makeRequest(`${import.meta.env.VITE_API_LINK}/mongo/piloti/${this.store.user.favDriver}`)
      this.favDriv = resp[0]
    },
    async checkIfShouldLoadLastRace() {
      try {
        const date = await getNext
        const now = new Date()
        const start = new Date(date.race.meetingStartDate)
        const diffMs = start - now
        const diffDays = diffMs / (1000 * 60 * 60 * 24)

        if (diffDays > 1) {
          const dateGetLast = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`)// presupune un helper `getLast.js` care face request la /get-last
          this.lastRaceData = dateGetLast
          const lastMeetingKey = dateGetLast.fomRaceId
          const seasonYear = dateGetLast.meetingContext.season
          const meetingSlug = lastMeetingKey + "_" + dateGetLast.race.meetingName.toLowerCase().replaceAll(" ", '-')
          const dataSessionComplet = await makeRequest(`${import.meta.env.VITE_API_LINK}/season-results/homepage/${seasonYear}/${meetingSlug}`)
          const sessionDate = new Date(dateGetLast.meetingContext.timetables[4].startTime)
          const day = sessionDate.getUTCDate().toString().padStart(2, '0')
          const month = (sessionDate.getUTCMonth() + 1).toString().padStart(2, '0')
          const year = sessionDate.getUTCFullYear()
          this.lastRaceDateText = `${day}-${month}-${year}`
          const dataApi = await makeRequest(`https://api.jolpi.ca/ergast/f1/${dateGetLast.meetingContext.season}.json?limit=100`)
          const rundaActuala = dataApi.MRData.RaceTable.Races[dateGetLast.meetingContext.nr_runda]
          const rundaLink = rundaActuala.raceName.replace(/\s+/g, '-').toLowerCase();
          const linkCursaVeche = `/schedule/${date.meetingContext.season}/${rundaLink}`
          this.top3Drivers = dataSessionComplet.topDriverResults
          this.top3Drivers.raceName = rundaActuala.raceName
          this.top3Drivers.linkCursaVeche = linkCursaVeche
          this.top3Teams = dataSessionComplet.topTeamResults
          this.top5Overtakers = dataSessionComplet.nrOfOvertakes.top_5_drivers.slice(0,3)
          await this.getVoteResultsPreview()
        }
      } catch (err) {
        console.log("Eroare la checkIfShouldLoadLastRace:", err)
      }
    },
    viewAllPodium() {
      this.showAllPodiums = !this.showAllPodiums;
    }
  },
}

</script>

<template>
  <div class="site-wrapper mb-2" :class="{ loggedin: store.user != null }">
    <div class="top-hero">
      <transition name="scale-fade" appear>
        <div v-if="Hero && heroData">
          <herocursa :heroData="heroData" :link="linkCursa" />
        </div>
      </transition>
    </div>
    <div
        v-if="store.user != null"
        class="pt-2"
    >
      <div
          class="flex flex-row h-[20rem] items-center justify-center my-6 gap-4"
          v-if="bla === true || driverOk === true"
      >
        <ConstructorCard
            :team="favouriteTeam"
            :darkMode="darkMode"
            class="sm:w-[20rem]"
            v-if="bla"
        />
        <PilotCard
            :pilot="favDriv"
            :darkMode="darkMode"
            class="sm:w-[25rem]"
            v-if="driverOk"
        />
      </div>
    </div>
    <div class="stiri-grid">
      <div v-if="lastRaceData" class="w-full max-w-7xl mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="lg:text-4xl text-5xl font-extrabold source text-black">
            🗳️ Fan's Choice Awards
          </h2>
          <p class="text-xl text-gray-600 mt-2 source">
            Current leaders from the fan vote for the {{ top3Drivers.raceName }}
          </p>
        </div>

        <div class="grid grid-cols-3 gap-6 text-center" v-if="showVotePreview">
          <div class="bg-white p-4 rounded-2xl shadow-md border border-gray-200 racefansgrid">
            <h4 class="text-lg font-semibold text-gray-800 mb-2 source">🏆 Best Point Scorer</h4>
            <img
                :src="voteResultsPreview.topScorer.driverData.driverImage"
                alt="Fan's choice for best scorer"
                class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-yellow-400"
            >
            <p class="mt-3 text-xl font-bold">{{ voteResultsPreview.topScorer.driverData.driverFirstName }} {{ voteResultsPreview.topScorer.driverData.driverLastName }}</p>
            <p class="text-gray-600">{{ voteResultsPreview.topScorer.driverData.displayTeamName }}</p>
          </div>

          <div class="bg-white p-4 rounded-2xl shadow-md border border-gray-200 racefansgrid">
            <h4 class="text-lg font-semibold text-gray-800 mb-2 source">⚔️ Best Of The Rest</h4>
            <img
                :src="voteResultsPreview.topRest.driverData.driverImage"
                alt="Fan's choice for best of the rest"
                class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-green-500"
            >
            <p class="mt-3 text-xl font-bold">{{ voteResultsPreview.topRest.driverData.driverFirstName }} {{ voteResultsPreview.topRest.driverData.driverLastName }}</p>
            <p class="text-gray-600 text-lg lg:text-md">{{ voteResultsPreview.topRest.driverData.displayTeamName }}</p>
          </div>

          <div class="bg-white p-4 rounded-2xl shadow-md border border-gray-200 racefansgrid">
            <h4 class="text-lg font-semibold text-gray-800 mb-2 source">🏆 Best Team</h4>
            <img
                :src="voteResultsPreview.topTeam.teamData.teamLogoImage"
                alt="Fan's choice for best team"
                class="w-24 h-24 rounded-full mx-auto object-contain p-2"
            >
            <p class="mt-3 text-xl font-bold">{{ voteResultsPreview.topTeam.teamData.displayTeamName }}</p>
          </div>
        </div>

        <div class="text-center mt-8">
          <router-link to="/vote">
            <ReusableButton fontSize="text-xl">
              See Full Results & Vote Now!
            </ReusableButton>
          </router-link>
        </div>
      </div>
      <Stiricomp />
      <div class="w-full" v-if="lastRaceData">
        <div class="text-center mb-10">
          <h2 class="text-4xl md:text-5xl font-extrabold source">
            🏆 Last race results
          </h2>
          <p v-if="lastRaceDateText" class="text-3xl text-gray-600 mt-2 font-bold source">
            {{ top3Drivers.raceName }}
          </p>
          <p v-if="lastRaceDateText" class="text-xl text-gray-600 mt-2 source">
            {{ lastRaceDateText }}
          </p>
        </div>
        <ReusablePodium :top3="top3Drivers">
          <template #firstPodiumSlot>
            <p class="font-bold text-center text-3xl lg:text-2xl">{{ top3Drivers[0].driverFirstName + " " + top3Drivers[0].driverLastName }}</p>
            <p class="text-lg lg:text-base text-center text-gray-800">{{ top3Drivers[0].displayTeamName }}</p>
            <p class="text-lg lg:text-base text-center text-gray-800">+{{ top3Drivers[0].racePoints }} pts</p>
            <p class="text-base lg:text-sm text-gray-600">{{ top3Drivers[0].raceTime }}</p>
          </template>
          <template #secondPodiumSlot>
            <p class="font-bold text-center text-3xl lg:text-2xl">{{ top3Drivers[1].driverFirstName + " " + top3Drivers[1].driverLastName }}</p>
            <p class="text-lg lg:text-base text-center text-gray-800">{{ top3Drivers[1].displayTeamName }}</p>
            <p class="text-lg lg:text-base text-center text-gray-800">+{{ top3Drivers[1].racePoints }} pts</p>
            <p class="text-base lg:text-sm text-gray-600">+{{ top3Drivers[1].gapToLeader }}</p>
          </template>
          <template #thirdPodiumSlot>
            <p class="font-bold text-center text-3xl lg:text-2xl">{{ top3Drivers[2].driverFirstName + " " + top3Drivers[2].driverLastName }}</p>
            <p class="text-lg lg:text-base text-center text-gray-800">{{ top3Drivers[2].displayTeamName }}</p>
            <p class="text-lg lg:text-base text-center text-gray-800">+{{ top3Drivers[2].racePoints }} pts</p>
            <p class="text-base lg:text-sm text-gray-600">+{{ top3Drivers[2].gapToLeader }}</p>
          </template>
        </ReusablePodium>
        <template v-if="showAllPodiums">
          <br />
          <ReusablePodium :top3="top3Teams" v-once>
            <template #firstPodiumSlot>
              <p class="font-bold text-center text-3xl lg:text-2xl">{{ top3Teams[0].team }}</p>
              <p class="text-lg font-semibold text-gray-800 mt-2">+{{ top3Teams[0].points }} pts</p>
            </template>
            <template #secondPodiumSlot>
              <p class="font-bold text-center text-3xl lg:text-2xl">{{ top3Teams[1].team }}</p>
              <p class="text-lg font-semibold text-gray-800 mt-2">+{{ top3Teams[1].points }} pts</p>
            </template>
            <template #thirdPodiumSlot>
              <p class="font-bold text-center text-3xl lg:text-2xl">{{ top3Teams[2].team }}</p>
              <p class="text-lg font-semibold text-gray-800 mt-2">+{{ top3Teams[2].points }} pts</p>
            </template>
          </ReusablePodium>
          <ReusablePodium :top3="top5Overtakers" title="Top 3 Overtakers" v-once>
            <template #firstPodiumSlot>
              <p class="font-bold text-center text-base md:text-2xl">{{ top5Overtakers[0].full_name }}</p>
              <p class="text-center text-base md:text-lg">{{ top5Overtakers[0].team_name }}</p>
              <p class="text-lg font-semibold text-gray-800">{{ top5Overtakers[0].overtakes }}</p>
            </template>
            <template #secondPodiumSlot>
              <p class="font-bold text-center text-base md:text-2xl">{{ top5Overtakers[1].full_name }}</p>
              <p class="text-center text-base md:text-lg">{{ top5Overtakers[1].team_name }}</p>
              <p class="text-lg font-semibold text-gray-800">{{ top5Overtakers[1].overtakes }}</p>
            </template>
            <template #thirdPodiumSlot>
              <p class="font-bold text-center text-base md:text-2xl">{{ top5Overtakers[2].full_name }}</p>
              <p class="text-center text-base md:text-lg">{{ top5Overtakers[2].team_name }}</p>
              <p class="text-lg font-semibold text-gray-800">{{ top5Overtakers[2].overtakes }}</p>
            </template>
          </ReusablePodium>
        </template>
        <div class="w-full flex justify-center align-center mt-8">
          <ReusableButton @click="viewAllPodium">
            {{ showAllPodiums ? 'View less results' : 'View more results' }}
          </ReusableButton>
        </div>
      </div>
    </div>
    <AccountCard v-if="store.user == null" />
  </div>
</template>

<style>
@import "../assets/home.scss";
@import "../assets/clasamentpiloti.scss";

@keyframes p-progress-spinner-color {
  100%,
  0% {
    stroke: #ff0000;
  }
  40% {
    stroke: #ff0000;
  }
  66% {
    stroke: #ff0000;
  }
  80%,
  90% {
    stroke: #ff0000;
  }
}

/* Animație pentru componenta herocursa la mount */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
.scale-fade-enter-to,
.scale-fade-leave-from {
  transform: scale(1);
  opacity: 1;
}

</style>