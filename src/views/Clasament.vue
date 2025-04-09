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
      .catch((err) => console.log(err.message)),
      (document.title = "Clasament echipe")
  },
  components: { ConstructorCard },
}
</script>

<style>
@import "../assets/clasament.css";
</style>
