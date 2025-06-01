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
    <!-- <p v-show="heroError" class="text-center text-xl mt-4">Please reload the page</p> -->
    <div class="stiri-grid">
      <stiricomp />
    </div>
    <AccountCard v-if="store.user == null" />
  </div>
</template>
<script>
import { useHead } from "@vueuse/head"
import herocursa from "../components/herocursa.vue"
import stiricomp from "../components/stiricomp.vue"
import getNext from "../functions/getNext.js"
import ConstructorCard from "../components/ConstructorCard.vue"
import PilotCard from "../components/PilotCard.vue"
import AccountCard from "../components/AccountCard.vue"
import axios from "axios"
import {makeRequest} from "@/functions/makeRequest";

export default {
  name: "Home",
  components: {
    herocursa,
    stiricomp,
    PilotCard,
    ConstructorCard,
    AccountCard,
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
    }
  },
  async mounted() {
    this.darkMode = localStorage.getItem("darkMode")
    await this.getCursa()
    useHead({
      title: "GridFanHub | Up-to-Date Formula 1 News & Insights",
      meta: [
        { name: "keywords", content: "Formula 1, F1, F1 news, F1 standings, Formula 1 calendar, F1 teams, F1 drivers, race results, F1 qualifying, F1 history, Formula 1 reaction game, Formula 1 Romania, F1 RO, formula1 ro, formula1 romania, F1 schedule" },
        { name: "description", content: "GridFanHub is your complete source of information about Formula 1: updated news, race schedules, live results, and standings for drivers and teams. Discover qualifying and race data, play a reaction game for F1 fans, and explore the fascinating history of this sport. All in one place, in English." },
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
      const resp = await axios(
        "https://api.jolpi.ca/ergast/f1/current/constructorstandings.json"
      )
      const echipe = resp.data
      const arr =
        echipe.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
      for (var i = 0; i < arr.length; i++) {
        if (date[i].name.includes(fav)) {
          this.favArr = arr[i]
        }
      }
    },
    async getFavDriver() {
      const resp = await axios(
        `${import.meta.env.VITE_API_LINK}/mongo/piloti/${
          this.store.user.favDriver
        }`
      )
      this.favDriv = resp.data[0]
    },
  },
}
</script>

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
