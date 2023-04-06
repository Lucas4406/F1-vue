<template>
  <br />
  <div class="container-curse">
    <div class="form-select">
      <label for="ancurse">Alege anul:</label>
      <select
        id="ancurse"
        name="ancurse"
        class="selectie"
        v-model="ancursaSelect"
        @change="anChange()"
      >
        <option v-for="year in years" :key="year" :value="year" class="optiune">
          {{ year }}
        </option>
      </select>
      <button
        @click="order"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-2 cursor-pointer border-solid border-red-500 hover:border-red-700"
      >
        <p v-if="!asc">Ascending</p>
        <p v-else>Descending</p>
      </button>
    </div>
    <p class="titlu-pagina-curse">{{ "Rezultate curse " + titlu }}</p>
    <div class="search-wrapper">
      <input
        type="text"
        v-model="search"
        placeholder="Căutare"
        class="search-bar"
      />
    </div>
    <tabelcursa v-for="cursa in filterCurse" :key="cursa.id" :cursa="cursa" />
  </div>
</template>

<script>
import tabelcursa from "../components/tabelcursa.vue"
import router from "../router"
import { makeRequest } from "../functions/makeRequest"
export default {
  name: "Curse",
  components: {
    tabelcursa,
  },
  data() {
    return {
      ancursaSelect: this.$route.params.an,
      titlu: "",
      dataCurse: [],
      search: "",
      asc: false,
    }
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData() {
      const response = await makeRequest(
        `https://ergast.com/api/f1/${this.ancursaSelect}/results.json?limit=1000`
      )
      const resData = response.MRData.RaceTable.Races
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
      this.dataCurse = resData
      this.dataCurse.reverse()
      this.titlu = response.MRData.RaceTable.season
      this.asc = false
      router.push({
        name: "Curse",
        params: { an: this.ancursaSelect },
      })
      document.title = `Rezultate Curse ${this.titlu}`
    },
    order() {
      if (this.asc == false) {
        this.dataCurse.reverse()
        this.asc = true
      } else {
        this.dataCurse.reverse()
        this.asc = false
      }
    },
    async anChange() {
      const response = await makeRequest(
        `https://ergast.com/api/f1/${this.ancursaSelect}/results.json?limit=1000`
      )
      const resData = response.MRData.RaceTable.Races
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
      this.dataCurse = resData

      this.titlu = response.MRData.RaceTable.season
      this.asc = false
      router.push({
        name: "Curse",
        params: { an: this.ancursaSelect },
      })
      document.title = `Rezultate Curse ${this.titlu}`
    },
  },
  computed: {
    filterCurse: function () {
      return this.dataCurse.filter((cursa) => {
        return (
          cursa.raceName.toLowerCase().match(this.search.toLowerCase()) ||
          cursa.Circuit.Location.country
            .toLowerCase()
            .match(this.search.toLowerCase())
        )
      })
    },
    years() {
      const startYear = 2014
      const endYear = 2023
      const years = []
      for (let i = startYear; i <= endYear; i++) {
        years.push(i)
      }
      return years.reverse()
    },
  },
}
</script>

<style scoped>
@import "../assets/curse.css";
@import "../assets/searchbar.css";
@import "../assets/formSelect-curse.css";
.fade-v-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
