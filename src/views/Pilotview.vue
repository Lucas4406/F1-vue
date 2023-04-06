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
      const data = await makeRequest(
        `https://ergast.com/api/f1/2023/drivers/${this.pilotId}/results.json`
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
      console.log(resData)
    },
    async getName() {
      let numePilot
      const data = await makeRequest(
        `${import.meta.env.VITE_API_LINK}/mongo/piloti?order=asc`
      )
      for (var i = 0; i < data.length; i++) {
        if (data[i].driver_id === this.pilotId) {
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
