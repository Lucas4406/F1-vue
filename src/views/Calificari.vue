<template>
  <div class="content-container">
    <div class="form-select">
      <label for="ancurse">Choose year:</label>
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
    </div>
    <div class="text-wrap">
      <p class="text-titlu" ref="titlul">
        {{ "Qualifying results " + titlu }}
      </p>
    </div>
<!--    <div class="search-wrapper">-->
<!--      <input-->
<!--        type="text"-->
<!--        placeholder="Use only after loading"-->
<!--        class="search-bar"-->
<!--        v-model="search"-->
<!--      />-->
<!--    </div>-->

      <tabelcali
        v-for="tabel in filterCurse"
        :key="tabel.id"
        :qualiData="tabel"
      />
    <div ref="sentinel" class="loading" v-if="this.currentRaceRound > 0">
      <p v-if="loading">Loading...</p>
      <p v-else>Scroll for more results</p>
    </div>
  </div>
</template>

<script>
import {useHead} from "@vueuse/head"
import tabelcali from "../components/tabelcali.vue"
import router from "../router"
import { makeRequest } from "../functions/makeRequest"
import getNext from "@/functions/getNext";
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
      titlu: "",
      totalRounds: null,
      loading: false,
      currentRaceRound: null,
    }
  },
  async mounted() {
    router.push({
      name: "Calificari",
      params: { an: this.ancaliSelect },
    })
    await this.fetchTotalRounds()
    if (this.$route.params.an === '2025') {
      this.currentRaceRound = await this.getCurrentRound();
    } else {
      this.currentRaceRound = this.totalRounds;
    }
    await this.getData()
    this.titlu = this.ancaliSelect
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
    this.setSeoMeta(this.ancaliSelect)

  },
  methods: {
    async getData() {
      if (this.loading || this.currentRaceRound < 1) {
        return;
      }
      this.loading = true;
      try {
        const response = await makeRequest(
            `https://api.jolpi.ca/ergast/f1/${this.ancaliSelect}/${this.currentRaceRound}/qualifying.json?limit=100`
        );
        if (response?.MRData?.RaceTable?.Races?.length > 0) {
          const race = response.MRData.RaceTable.Races[0];
          this.dataQuali.push(race);
          this.currentRaceRound--;
        } else {
          this.currentRaceRound = 0;
        }
      } catch (error) {
        console.error("Error fetching qualifying round:", error);
        this.currentRaceRound = 0;
      } finally {
        this.loading = false;
      }
    },
    async fetchTotalRounds() {
      try {
        const response = await makeRequest(
            `https://api.jolpi.ca/ergast/f1/${this.ancaliSelect}.json?limit=100`
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
        const response = await getNext;
        let nr_runda = response.meetingContext.nr_runda + 1;

        // Coboară până găsești o rundă validă în Ergast API
        while (nr_runda > 0) {
          const checkErgast = await makeRequest(
              `https://api.jolpi.ca/ergast/f1/2025/${nr_runda}/qualifying.json`
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
    async anChange() {
      this.dataQuali = [];
      this.currentRaceRound = null;
      this.totalRounds = null;
      this.loading = true;
      router.push({ name: "Calificari", params: { an: this.ancaliSelect } });
      this.titlu =this.ancaliSelect
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
      this.titlu = this.ancaliSelect;
      // this.asc = false;
      this.setSeoMeta(this.ancaliSelect)

    },
    setSeoMeta(year) {
      useHead({
        title: `GridFanHub | Qualifying results ${year}`,
        meta: [
          { name: "description", content: `Complete qualifying results for Formula 1 season ${year} on GridFanHub.` },
          { name: "keywords", content: `F1 qualifying ${year}, Formula 1 qualifying results, F1 ${year} season, Formula 1 calendar, F1 news, gridfanhub, f1, formula1, qualifying clasification, calificari, qualifying data, multiple years, 2014-2025, gridfanhub qualifying data, updated qualifying, f1 site data, formula1 qualifying, lewis hamilton, oscar piastri, max vrestappen, fastestlap, fastest lap` },
          { property: "og:title", content: `GridFanHub | Qualifying results ${year}` },
          { property: "og:description", content: `Complete qualifying results for Formula 1 season ${year} on GridFanHub.` },
          { property: "og:type", content: "website" },
          { property: "og:url", content: `https://gridfanhub.com/qualifying-results/${year}` },
          { property: "og:image", content: "https://gridfanhub.com/favicon.ico" },
          { property: "twitter:card", content: "summary_large_image" },
          { property: "twitter:title", content: `GridFanHub | Qualifying results ${year}` },
          { property: "twitter:description", content: `Complete qualifying results for Formula 1 season ${year} on GridFanHub.` },
          { property: "twitter:image", content: "https://gridfanhub.com/favicon.ico" },
          { name: "robots", content: "index, follow" },
        ],
        link: [
          { rel: "canonical", href: `https://gridfanhub.com/qualifying-results/${year}` }
        ],
      })
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
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
