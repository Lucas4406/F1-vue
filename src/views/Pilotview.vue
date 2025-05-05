<template>
  <br />
  <div class="container-curse">
    <p class="titlu-pagina-curse">{{ "Rezultate " + numePil + " " + titlu }}</p>
    <rezultatePiloti v-for="cursa in curse" :key="cursa.id" :cursa="cursa" />
  </div>
</template>

<script>
import rezultatePiloti from "../components/RezultatePilot.vue"
import { makeRequest } from "../functions/makeRequest"
export default {
  data() {
    return {
      curse: [],
      titlu: "",
      numePil: "",
    }
  },
  components: { rezultatePiloti },
  async mounted() {
    await this.fetchData()
    await this.getName()
  },
  methods: {
    async fetchData() {
      let driverId_obtinut
      const numeId = await makeRequest("https://api.jolpi.ca/ergast/f1/2025/drivers.json")
      for (let i = 0; i < numeId.MRData.DriverTable.Drivers.length; i++) {
        const numeCod = numeId.MRData.DriverTable.Drivers[i]
        if( numeCod.code === this.pilotId){
            driverId_obtinut = numeCod.driverId
        }
      }
      const data = await makeRequest(
        `https://api.jolpi.ca/ergast/f1/2025/drivers/${driverId_obtinut}/results.json?limit=100`
      )
      const resData = data.MRData.RaceTable.Races.reverse()
      for (var i = 0; i < resData.length; i++) {
        for (var j = 0; j < resData[i].Results.length; j++) {
          if (resData[i].Results[j].FastestLap === undefined) {
            resData[i].Results[j].FastestLap = "-"
          } else {
            resData[i].Results[j].FastestLap =
              resData[i].Results[j].FastestLap.Time.time
          }
        }
      }
      this.titlu = data.MRData.RaceTable.season
      this.curse = resData
    },
    async getName() {
      let numePilot
      const data = await makeRequest(
        `${import.meta.env.VITE_API_LINK}/mongo/piloti?order=asc`
      )
      for (var i = 0; i < data.length; i++) {
        if (data[i].alDoileaNume.slice(0, 3).toUpperCase() === this.pilotId) {
          numePilot = data[i].primulNume + " " + data[i].alDoileaNume
        }
      }
      this.numePil = numePilot
      document.title = `Rezultate ${numePilot}`
    },
  },
  computed: {
    pilotId() {
      return this.$route.params.id
    },
  },
}
</script>

<style scoped>
@import "../components/css/rezultatePilot.scss";
</style>
