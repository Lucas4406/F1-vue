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
  </div>
</template>
<script>
import herocursa from "../components/herocursa.vue"
import stiricomp from "../components/stiricomp.vue"
import getNext from "../functions/getNext.js"
import axios from "axios"

export default {
  name: "Home",
  components: {
    herocursa,
    stiricomp,
  },
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
    }
  },
  mounted() {
    document.title = "Acasă"
    if (this.darkMode) {
      document.body.classList.add("darkmode")
    } else {
      document.body.classList.remove("darkmode")
    }
    this.getCursa()
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
