<script>
import axios from "axios";
import tabelcursa from "@/components/tabelcursa.vue";
import tabelcali from "@/components/tabelcali.vue";
import Tabelsprint from "@/components/tabelsprint.vue";
export default {
  name: "Meeting",
  components: {Tabelsprint, tabelcali, tabelcursa},
  data() {
    return {
      an: this.$route.params.an,
      meetingName: this.$route.params.meeting_name,
      curse: null,
      nrCursa: null,
      cursaData: null,
      sprintData: null,
      qualiData: null,
    }
  },
  methods: {
    async fetchData (link){
      const date = await axios.get(link)
      return date.data
    },
    async getData () {
      let isSprint = false
      const meetingNameSpace = this.meetingName.replaceAll('_' , " ")
      const response = await this.fetchData(`https://api.jolpi.ca/ergast/f1/${this.an}.json?limit=100`)
      const resData = response.MRData.RaceTable.Races
      this.curse = resData
      for(let i = 0 ; i<resData.length; i++) {
        if(meetingNameSpace === resData[i].raceName) {
          this.nrCursa = i
        }
      }
      const linkFormat = `https://api.jolpi.ca/ergast/f1/${this.an}/${this.nrCursa + 1}`
      const terminare = ".json?limit=100"
      const qualiData = await this.fetchData(linkFormat + "/qualifying" + terminare)
      const qualiDataFormat = qualiData.MRData.RaceTable.Races[0]
      if(qualiDataFormat !== undefined) {
        this.qualiData = qualiDataFormat
      }
      const raceData = await this.fetchData(linkFormat + "/results" + terminare)
      const raceDataFormat = raceData.MRData.RaceTable.Races[0]
      if (raceDataFormat !== undefined) {
        for (const result of raceDataFormat.Results) {
          result.FastestLap = result.FastestLap?.Time?.time || "-";
        }
        this.cursaData = raceDataFormat
      }
      if(resData[this.nrCursa].Sprint !== undefined){
        isSprint = true
      }
      if(isSprint === true){
        const sprintData = await this.fetchData(linkFormat + "/sprint" + terminare)
        const sprintDataFormat = sprintData.MRData.RaceTable.Races[0]
        for (const result of sprintDataFormat.SprintResults) {
          result.FastestLap = result.FastestLap?.Time?.time || "-";
        }
        this.sprintData = sprintDataFormat
        console.log(sprintDataFormat)
      }
      let link_api = `${import.meta.env.VITE_API_LINK}/mongo/RaceData/all`
      const res = await axios.get(link_api)
      const dateActualeApi = res.data[this.nrCursa]
      const dateActualeErgast = resData[this.nrCursa]
    }
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<template>
  <br />
  <div class="container-curse">
    <p class="titlu-pagina-curse">{{ "Rezultate " + meetingName.replaceAll("_" , " ") + " " + an }}</p>
    <p class="titlu-pagina-curse" v-if="!cursaData && !qualiData && !sprintData" >Rezultatele vor aparea dupa finalizarea sesiunii respective</p>
    <p class="titlu-pagina-curse" v-if="cursaData">Rezultate cursa</p>
    <tabelcursa :cursa="cursaData" v-if="cursaData"/>
    <br v-if="cursaData" />
    <p class="titlu-pagina-curse" v-if="qualiData">Rezultate calificari</p>
    <tabelcali
        :qualiData="qualiData" v-if="qualiData"
    />
    <br v-if="sprintData" />
    <p class="titlu-pagina-curse" v-if="sprintData">Rezultate sprint</p>
    <tabelsprint :cursa="sprintData" v-if="sprintData"/>
    <br />
  </div>
</template>

<style scoped>
@import "../assets/curse.css";
</style>
