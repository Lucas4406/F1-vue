<template>
  <div class="content-container">
    <div class="form-select">
      <label for="ancurse">Alege anul:</label>
      <select
        id="ancurse"
        name="ancurse"
        class="selectie"
        v-model="ancaliSelect"
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
    <div class="text-wrap">
      <p class="text-titlu" ref="titlul">
        {{ "Rezultate calificări " + titlu }}
      </p>
    </div>
    <div class="search-wrapper">
      <input
        type="text"
        placeholder="Căutare"
        class="search-bar"
        v-model="search"
      />
    </div>
    <tabelcali
      v-for="tabel in filterCurse"
      :key="tabel.id"
      :qualiData="tabel"
    />
  </div>
</template>

<script>
import tabelcali from "../components/tabelcali.vue"
import router from "../router"
import { makeRequest } from "../functions/makeRequest"
export default {
  name: "Calificari",
  components: {
    tabelcali,
  },
  data() {
    return {
      ancaliSelect: this.$route.params.an,
      dataQuali: [],
      search: "",
      asc: false,
      titlu: "",
    }
  },
  async mounted() {
    await this.getData()
  },
  async updated() {},
  methods: {
    async getData() {
      const data = await makeRequest(
        `https://api.jolpi.ca/ergast/f1/${this.ancaliSelect}/constructorstandings.json?limit=100`
      )
      this.titlu = data.MRData.RaceTable.season
      this.dataQuali = data.MRData.RaceTable.Races
      this.dataQuali.reverse()
      this.asc = false
      router.push({
        name: "Calificari",
        params: { an: this.ancaliSelect },
      })
      document.title = `Rezultate Calificări ${this.titlu}`
    },
    order() {
      if (this.asc == false) {
        this.dataQuali.reverse()
        this.asc = true
      } else {
        this.dataQuali.reverse()
        this.asc = false
      }
    },
    async anChange() {
      const data = await makeRequest(
        `https://api.jolpi.ca/ergast/f1/${this.ancaliSelect}/constructorstandings.json?limit=100`
      )
      this.titlu = data.MRData.RaceTable.season
      this.dataQuali = data.MRData.RaceTable.Races
      this.dataQuali.reverse()
      this.asc = false
      router.push({
        name: "Calificari",
        params: { an: this.ancaliSelect },
      })
      document.title = `Rezultate Calificări ${this.titlu}`
    },
  },
  computed: {
    filterCurse: function () {
      return this.dataQuali.filter((tabel) => {
        return (
          tabel.raceName.toLowerCase().match(this.search.toLowerCase()) ||
          tabel.Circuit.Location.country
            .toLowerCase()
            .match(this.search.toLowerCase())
        )
      })
    },
    years() {
      const startYear = 2014
      const endYear = 2025
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
@import "../assets/calificari.css";
@import "../assets/searchbar.css";
@import "../assets/formSelect-curse.css";
</style>
