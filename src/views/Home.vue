<template>
  <div class="site-wrapper mb-2">
    <br />
    <herocursa
      v-show="Hero"
      :dataInceput="dataInceput"
      :dataSfarsit="dataSfarsit"
      :lunaCursa="lunaCursa"
      :pozaHarta="pozaHarta"
      :imagineMare="imagineMare"
      :runda="runda"
      :steag="steag"
      :tara="tara"
    />
    <!-- <p v-show="heroError" class="text-center text-xl mt-4">Please reload the page</p> -->
    <div class="stiri-grid">
      <stiricomp />
    </div>
    <v-lazy
      :options="{ threshold: 1 }"
      transition="fade-transition"
      v-model="modelValue"
    >
      <div
        class="flex flex-row h-[20rem] items-center justify-center my-6 gap-4"
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
  </div>
</template>
<script>
import herocursa from "../components/herocursa.vue"
import stiricomp from "../components/stiricomp.vue"
import getNext from "../functions/getNext.js"
import ConstructorCard from "../components/ConstructorCard.vue"
import PilotCard from "../components/PilotCard.vue"
import axios from "axios"

export default {
  name: "Home",
  components: {
    herocursa,
    stiricomp,
    PilotCard,
    ConstructorCard,
  },
  inject: ["store"],
  data() {
    let darkMode = localStorage.getItem("darkMode") == "true"
    return {
      darkMode,
      dataInceput: "",
      dataSfarsit: "",
      lunaCursa: "",
      pozaHarta: "",
      imagineMare: "",
      runda: "",
      steag: "",
      tara: "",
      Hero: false,
      heroError: false,
      componentKey: 0,
      favArr: [],
      favDriv: [],
      bla: false,
      driverOk: false,
      modelValue: false,
    }
  },
  async mounted() {
    document.title = "Acasă"
    if (this.darkMode) {
      document.body.classList.add("darkmode")
    } else {
      document.body.classList.remove("darkmode")
    }
    this.getCursa()
  },
  async updated() {
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
  },
  methods: {
    handleErr(val) {
      if (val === true) {
        this.componentKey += 1
        console.log("component reloaded")
      }
    },
    forceRerender() {
      this.componentKey += 1
    },
    async getCursa() {
      try {
        let nrCursa = await getNext
        var j = nrCursa
        var link = `${import.meta.env.VITE_API_LINK}/up-next/${j}`
        const response = await axios.get(link)
        const resData = response.data
        this.dataInceput = resData.dataCursa1
        this.dataSfarsit = resData.dataCursa2
        this.lunaCursa = resData.lunaCursa
        this.pozaHarta = resData.harta
        this.imagineMare = resData.imagine
        this.runda = resData.runda
        this.steag = resData.steag
        this.tara = resData.tara
        this.Hero = true
      } catch (error) {
        console.log(error)
        /* this.heroError = true
                this.forceRerender() */
      }
    },
    async favoriteTeam() {
      const fav = this.store.user.favTeam.substring(0, 4)
      const resp = await axios(
        "https://ergast.com/api/f1/2023/constructorStandings.json"
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
@import "../assets/home.css";
@import "../assets/dkmodebtn.css";

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
