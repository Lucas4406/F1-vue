<script>
import getNext from "@/functions/getNext.js"
import ConstructorCard from "@/components/ConstructorCard.vue";
import PilotCard from "@/components/PilotCard.vue";
import herocursa from "@/components/herocursa.vue";
import {makeRequest} from "@/functions/makeRequest";
import Podium from "@/components/Podium.vue"
import Stiricomp from "@/components/stiricomp.vue";
import {useHead} from "@vueuse/head";
import AccountCard from "@/components/AccountCard.vue";

export default {
  name: "Home",
  components: {
    AccountCard,
    Stiricomp,
    Podium,
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
      favArr: [],
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
        var dataI = dataInc.getDate()
        var dataS = dataSf.getDate()
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
        const rundaLink = rundaActuala.raceName.replace(/\s+/g, '_');
        this.linkCursa = `/schedule/${date.meetingContext.season}/${rundaLink}`
        this.heroData = date
        this.Hero = true
      } catch (error) {
        console.log(error)
      }
    },
    async favoriteTeam() {
      const fav = this.store.user.favTeam.substring(0, 4)
      const date = await makeRequest(`${import.meta.env.VITE_API_LINK}/mongo/teams/all`)
      const echipe = await makeRequest("https://api.jolpi.ca/ergast/f1/current/constructorstandings.json")
      const arr =
          echipe.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
      for (var i = 0; i < arr.length; i++) {
        if (date[i].name.includes(fav)) {
          this.favArr = arr[i]
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

        if (diffDays > 2) {
          const dateGetLast = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-last`)// presupune un helper `getLast.js` care face request la /get-last
          this.lastRaceData = dateGetLast
          const lastMeetingKey = dateGetLast.fomRaceId
          const allSessions = dateGetLast.meetingContext.OpenF1sessions
          const allsessionsReversed = allSessions.reverse()
          const sessionKey = allsessionsReversed[0].session_key
          const dataSessionComplet = await makeRequest(`${import.meta.env.VITE_API_LINK}/season-results/${lastMeetingKey}/${sessionKey}`)
          const sessionData = allsessionsReversed[0]
          const sessionDate = new Date(sessionData.date_start)
          const day = sessionDate.getUTCDate().toString().padStart(2, '0')
          const month = (sessionDate.getUTCMonth() + 1).toString().padStart(2, '0')
          const year = sessionDate.getUTCFullYear()
          this.lastRaceDateText = `${day}-${month}-${year}`
          const dataApi = await makeRequest(`https://api.jolpi.ca/ergast/f1/${dateGetLast.meetingContext.season}.json?limit=100`)
          const rundaActuala = dataApi.MRData.RaceTable.Races[dateGetLast.meetingContext.nr_runda]
          const rundaLink = rundaActuala.raceName.replace(/\s+/g, '_');
          const linkCursaVeche = `/schedule/${date.meetingContext.season}/${rundaLink}`
          this.top3Drivers = dataSessionComplet.topDriverResults
          this.top3Drivers.raceName = rundaActuala.raceName
          this.top3Drivers.linkCursaVeche = linkCursaVeche
          this.top3Teams = dataSessionComplet.topTeamResults
          this.top5Overtakers = dataSessionComplet.nrOfOvertakes.top_5_drivers
        }
      } catch (err) {
        console.log("Eroare la checkIfShouldLoadLastRace:", err)
      }
    },
  },
}

</script>

<template>
  <div class="site-wrapper mb-2" :class="{ loggedin: store.user != null }">
    <br />
    <div class="top-hero">
      <transition name="scale-fade" appear>
        <div v-if="Hero && heroData">
          <herocursa :heroData="heroData" :link="linkCursa" />
        </div>
      </transition>
    </div>
    <br />
    <div
        v-if="store.user != null"
    >
      <div
          class="flex flex-row h-[20rem] items-center justify-center my-6 gap-4"
          v-if="bla === true && driverOk === true"
      >
        <ConstructorCard
            :team="favArr"
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
      <div class="text-center mb-10" v-if="lastRaceData">
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
      <Podium :top3="top3Drivers" v-if="top3Drivers.linkCursaVeche"/>
      <br />
      <div class="flex flex-col md:flex-row justify-center items-center md:items-end gap-8 md:h-[24rem]" v-if="lastRaceData">
        <!-- Locul 2 -->
        <div v-if="top3Teams[1]" class="flex flex-col items-center w-72 md:w-56 transition-transform duration-200 hover:scale-105">
          <div class="bg-gray-500 text-white text-lg md:text-xl px-5 py-2 rounded-t-xl shadow font-bold">2</div>
          <div class="bg-gray-100 w-full h-56 md:h-72 rounded-b-xl flex flex-col justify-center items-center shadow-md border-[6px] border-black border-t-0 px-4">
            <p class="font-semibold text-center text-base md:text-lg">{{ top3Teams[1].team }}</p>
            <p class="text-base text-gray-800">{{ top3Teams[1].points }} pts</p>
          </div>
        </div>

        <!-- Locul 1 -->
        <div v-if="top3Teams[0]" class="flex flex-col items-center w-72 md:w-60 transition-transform duration-200 hover:scale-105">
          <div class="bg-yellow-400 text-black text-lg md:text-xl px-5 py-2 rounded-t-xl shadow font-bold">1</div>
          <div class="bg-yellow-100 w-full h-64 md:h-80 rounded-b-xl flex flex-col justify-center items-center shadow-xl border-[6px] border-yellow-400 border-t-0 px-4">
            <p class="font-bold text-center text-base md:text-lg">{{ top3Teams[0].team }}</p>
            <p class="text-base font-semibold text-gray-900">{{ top3Teams[0].points }} pts</p>
          </div>
        </div>

        <!-- Locul 3 -->
        <div v-if="top3Teams[2]" class="flex flex-col items-center w-72 md:w-52 transition-transform duration-200 hover:scale-105">
          <div class="bg-orange-500 text-white text-lg md:text-xl px-5 py-2 rounded-t-xl shadow font-bold">3</div>
          <div class="bg-orange-100 w-full h-52 md:h-64 rounded-b-xl flex flex-col justify-center items-center shadow-md border-[6px] border-black border-t-0 px-4">
            <p class="font-semibold text-center text-base md:text-lg">{{ top3Teams[2].team }}</p>
            <p class="text-base text-gray-800">{{ top3Teams[2].points }} pts</p>
          </div>
        </div>
      </div>
      <Stiricomp />
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