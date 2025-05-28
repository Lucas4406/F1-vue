<template>
  <div class="site-wrapper mb-2" :class="{ loggedin: store.user != null }">
    <br />
    <div class="top-hero">
      <herocursa v-show="Hero" v-if="heroData" :heroData="heroData" :smallText="smallText" />
    </div>
    <br />
    <v-lazy
        :options="{ threshold: 1 }"
        transition="fade-transition"
        v-model="modelValue"
    >
      <div
          class="flex flex-row h-[20rem] items-center justify-center my-6 gap-4"
          v-if="store.user != null && (bla || driverOk)"
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
    </v-lazy>
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
    let darkMode = localStorage.getItem("darkMode") === "true"
    return {
      darkMode,
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
    }
  },
  async mounted() {
    await this.getCursa()
    if (this.darkMode) {
      document.body.classList.add("darkmode")
    } else {
      document.body.classList.remove("darkmode")
    }
    useHead({
      title: "GridFanHub | Regularly Updated Formula 1 News & Data",
      meta: [
        { name: "keywords", content: "Formula 1, F1, F1 news, F1 standings, Formula 1 calendar, F1 teams, F1 drivers, race results, F1 qualifying, F1 history, Formula 1 reaction game, Formula 1 Romania, F1 RO, formula1 ro, formula1 romania, F1 schedule" },
        { name: "description", content: "GridFanHub is your complete source of information about Formula 1: updated news, race schedules, live results, and standings for drivers and teams. Discover qualifying and race data, play a reaction game for F1 fans, and explore the fascinating history of this sport. All in one place, in English." },
        { name: "author", content: "GridFanHub" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },

        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://gridfanhub.com" },
        { property: "og:title", content: "GridFanHub - Constantly Updated News, Standings and Results" },
        { property: "og:description", content: "GridFanHub is your complete source of information about Formula 1" },
        { property: "og:image", content: "https://gridfanhub.com/favicon.ico" },

        // Twitter
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://gridfanhub.com" },
        { property: "twitter:title", content: "GridFanHub - Constantly Updated News, Standings and Results" },
        { property: "twitter:description", content: "GridFanHub is your complete source of information about Formula 1" },
        { property: "twitter:image", content: "https://gridfanhub.com/favicon.ico" },
      ],
      link: [
        { rel: "canonical", href: "https://gridfanhub.com" }
      ]
    })
  },

  async updated() {
    if(this.store.user){
      if (this.modelValue === true) {
        if (this.store.user.favTeam != null) {
          await this.favoriteTeam()
          this.bla = true
        }
        if (this.store.user.favDriver != null) {
          await this.getFavDriver()
          this.driverOk = true
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
        this.heroData = date
        this.Hero = true
      } catch (error) {
        console.log(error)
      }
    },
    async favoriteTeam() {
      const fav = this.store.user.favTeam.substring(0, 4)
      const resp = await axios(
        "https://api.jolpi.ca/ergast/f1/current/constructorstandings.json"
      )
      const echipe = resp.data
      const arr =
        echipe.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].Constructor.name.includes(fav)) {
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
</style>
