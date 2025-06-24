<template>
  <div class="content-container-echipe mb-4">
    <div
      v-for="team in teams"
      v-bind:key="team.id"
      class="constructor-container"
    >
      <ConstructorCard class="responsive-card" :team="team" />
    </div>
  </div>
</template>
<script>
import ConstructorCard from "../components/ConstructorCard.vue"
import {useHead} from "@vueuse/head"

export default {
  name: "Clasament",
  data() {
    return {
      teams: [],
    }
  },
  mounted() {
    fetch("https://api.jolpi.ca/ergast/f1/2025/constructorstandings.json")
      .then((res) => res.json())
      .then((data) => {
        this.teams =
          data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
      })
      .catch((err) => console.log(err.message))
  },
  components: { ConstructorCard },
  methods: {
    setHead() {
      useHead({
        title: "GridFanHub | Formula 1 2025 team standings",
        meta: [
          {
            name: "description",
            content:
                "Check the latest Formula 1 2025 team standings including all constructors' points and rankings updated live.",
          },
          {
            name: "keywords",
            content:
                "F1 2025 constructor standings, Formula 1 teams 2025, F1 2025 rankings, constructor championship 2025, F1 standings by team",
          },
          {
            name: "robots",
            content: "index, follow",
          },
          {
            property: "og:title",
            content: "GridFanHub | Formula 1 2025 team standings",
          },
          {
            property: "og:description",
            content:
                "Explore the up-to-date constructor standings in Formula 1 2025. See which teams lead the championship.",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:url",
            content: "https://gridfanhub.com/team-standings",
          },
          {
            property: "og:image",
            content: "https://gridfanhub.com/favicon.ico", // imagine OG reală recomandată
          },
          {
            name: "twitter:card",
            content: "summary_large_image",
          },
          {
            name: "twitter:title",
            content: "GridFanHub | Formula 1 2025 team standings",
          },
          {
            name: "twitter:description",
            content:
                "Live updated team rankings for Formula 1 2025. Track every constructor’s progress this season.",
          },
          {
            name: "twitter:image",
            content: "https://gridfanhub.com/favicon.ico", // imagine OG reală recomandată
          },
        ],
        link: [
          {
            rel: "canonical",
            href: "https://gridfanhub.com/team-standings",
          },
        ],
      })
    },
  }
}
</script>

<!--<style>-->
<!--@import "../assets/clasament.css";-->
<!--</style>-->
