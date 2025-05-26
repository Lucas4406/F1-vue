<template>
  <br />
  <div class="container-curse">
    <div class="form-select">
      <label for="ancurse">Choose year:</label>
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
<!--      <button-->
<!--        @click="order"-->
<!--        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-2 cursor-pointer border-solid border-red-500 hover:border-red-700"-->
<!--      >-->
<!--        <p v-if="!asc">Ascending</p>-->
<!--        <p v-else>Descending</p>-->
<!--      </button>-->
    </div>
    <p class="titlu-pagina-curse">{{ "Race results " + titlu }}</p>
    <div class="search-wrapper">
      <input
        type="text"
        v-model="search"
        placeholder="Use only after loading"
        class="search-bar"
      />
    </div>
    <tabelcursa v-for="cursa in filterCurse" :key="cursa.id" :cursa="cursa" />
    <div ref="sentinel" class="loading" v-if="this.currentRaceRound > 0">
      <p v-if="loading">Loading...</p>
      <p v-else>Scroll for more races</p>
    </div>
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
      // asc: false,
      totalRounds: null,
      loading: false,
      currentRaceRound: null,
    }
  },
  async mounted() {
    router.push({
      name: "Curse",
      params: { an: this.$route.params.an },
    })
    await this.fetchTotalRounds()
    if (this.$route.params.an === '2025') {
      this.currentRaceRound = await this.getCurrentRound();
    } else {
      this.currentRaceRound = this.totalRounds;
    }
    await this.getData()
    this.titlu = this.ancursaSelect
    document.title = `Race results ${this.titlu}`
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && this.currentRaceRound > 0 && !this.loading) {
        await this.getData()
      }
    }, { threshold: 0.1 })

    this.$nextTick(() => {
      const sentinel = this.$refs.sentinel
      if (sentinel) {
        observer.observe(sentinel)
      }
    })
  },
  methods: {
    async getData() {
      if (this.loading || this.currentRaceRound < 1) {
        return;
      }
      this.loading = true;
      try {
        const response = await makeRequest(
            `https://api.jolpi.ca/ergast/f1/${this.ancursaSelect}/${this.currentRaceRound}/results.json?limit=100`
        );
        if (response?.MRData?.RaceTable?.Races?.length > 0) {
          const race = response.MRData.RaceTable.Races[0];
          for (const result of race.Results) {
            result.FastestLap = result.FastestLap?.Time?.time || "-";
          }
          this.dataCurse.push(race);
          this.currentRaceRound--;
        } else {
          this.currentRaceRound = 0;
        }
      } catch (error) {
        console.error("Error fetching race round:", error);
        this.currentRaceRound = 0;
      } finally {
        this.loading = false;
      }
    },
    async fetchTotalRounds() {
      try {
        const response = await makeRequest(
            `https://api.jolpi.ca/ergast/f1/${this.ancursaSelect}.json?limit=100`
        );
        const races = response?.MRData?.RaceTable?.Races;
        if (races) {
          this.totalRounds = races.length;
          this.currentRaceRound = this.totalRounds; // Setează și aici, pentru siguranță
        } else {
          this.totalRounds = 0;
          this.currentRaceRound = 0;
        }
      } catch (error) {
        console.error("Error fetching total rounds:", error);
        this.totalRounds = 0;
        this.currentRaceRound = 0;
      }
    },
    async getCurrentRound() {
      try {
        const response = await makeRequest(`${import.meta.env.VITE_API_LINK}/get-next`);
        let nr_runda = response.meetingContext.nr_runda + 1;

        // Coboară până găsești o rundă validă în Ergast API
        while (nr_runda > 0) {
          const checkErgast = await makeRequest(
              `https://api.jolpi.ca/ergast/f1/2025/${nr_runda}/results.json`
          );

          const exists = checkErgast?.MRData?.RaceTable?.Races?.length > 0;
          if (exists) {
            return nr_runda;
          }
          nr_runda--; // Scade și încearcă din nou
        }
        return 0; // Dacă nicio rundă nu e disponibilă
      } catch (error) {
        console.error("Eroare la getCurrentRound:", error);
        return 0;
      }
    },
    // order() {
    //   if (this.asc == false) {
    //     this.dataCurse.reverse()
    //     this.asc = true
    //   } else {
    //     this.dataCurse.reverse()
    //     this.asc = false
    //   }
    // },
    async anChange() {
      this.dataCurse = [];
      this.currentRaceRound = null;
      this.totalRounds = null;
      this.loading = true;
      router.push({ name: "Curse", params: { an: this.ancursaSelect } });
      this.titlu =this.ancursaSelect
      document.title = `Race results ${this.titlu}`
      try {
        await this.fetchTotalRounds();
        if (this.$route.params.an === '2025') {
          this.currentRaceRound = await this.getCurrentRound()
        } else {
          this.currentRaceRound = this.totalRounds;
        }
      } catch (error) {
        console.error("Error fetching total rounds:", error);
      } finally {
        this.loading = false;
      }
      // Apelăm getData() acum, după ce loading ar trebui să fie false
      await this.getData();
      const observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && this.currentRaceRound > 0 && !this.loading) {
          await this.getData()
        }
      }, { threshold: 0.1 })

      this.$nextTick(() => {
        const sentinel = this.$refs.sentinel
        if (sentinel) {
          observer.observe(sentinel)
        }
      })
      this.titlu = this.ancursaSelect;
      // this.asc = false;
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
.loading {
  text-align: center;
  margin: 20px 0;
  color: gray;
}
</style>
