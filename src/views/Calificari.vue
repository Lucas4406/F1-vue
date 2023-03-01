<template>
  <div class="content-container">
    <div class="form-select" :class="{ darkmode: darkMode }">
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
    <div class="scroll-btns" v-show="show">
      <button class="darkmodeBtn" @click="darkModeToggle()">
        <img
          src="/night-mode.png"
          class="poza1"
          :class="{ darkmode: darkMode }"
        />
        <img
          src="/brightness.png"
          class="poza2"
          :class="{ darkmode: darkMode }"
        />
      </button>
    </div>
    <div class="text-wrap" :class="{ darkmode: darkMode }">
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
        :class="{ darkmode: darkMode }"
      />
    </div>
    <tabelcali
      v-for="tabel in filterCurse"
      :key="tabel.id"
      :qualiData="tabel"
      :darkMode="darkMode"
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
    let darkMode = localStorage.getItem("darkMode") == "true"
    return {
      darkMode,
      ancaliSelect: this.$route.params.an,
      show: false,
      textButon: false,
      dataQuali: [],
      search: "",
      asc: false,
      titlu: "",
    }
  },
  async mounted() {
    this.show = true
    document.title = "Rezultate calificari"
    if (this.darkMode) {
      document.body.classList.add("darkmode")
    } else {
      document.body.classList.remove("darkmode")
    }
    this.show = true
    await this.getData()
  },
  async updated() {},
  methods: {
    darkModeToggle() {
      this.darkMode = !this.darkMode
      localStorage.setItem("darkMode", this.darkMode)
      if (this.darkMode) {
        document.body.classList.add("darkmode")
      } else {
        document.body.classList.remove("darkmode")
      }
    },
    async getData() {
      const data = await makeRequest(
        `https://ergast.com/api/f1/${this.ancaliSelect}/qualifying.json?limit=1000`
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
        `https://ergast.com/api/f1/${this.ancaliSelect}/qualifying.json?limit=1000`
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
@import "../assets/calificari.css";
@import "../assets/searchbar.css";
</style>
