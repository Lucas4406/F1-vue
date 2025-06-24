<template>
  <router-link to="/teams" class="card-const text-inherit no-underline hover:no-underline" :class="{ darkmode: darkMode }">
    <div class="partesus">
      <p class="pozitie" id="pozitie" :class="{ darkmode: darkMode }">
        {{ team.pozitie }}
      </p>
      <p class="nume-echipa" id="numeEchipa">{{ team.name }}</p>
    </div>
    <div class="partejos">
      <div class="curse-castigate-cont" :class="{ darkmode: darkMode }">
        <p class="text-curse">Races won</p>
        <p class="curse-castigate" id="curseCastigate">{{ team.curseCastigate }}</p>
      </div>
      <div class="nrpuncte-cont" :class="{ darkmode: darkMode }">
        <p class="text-puncte">Points</p>
        <p class="nrpuncte" id="nrpuncte">{{ team.nrpuncte }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["team", "darkMode"],
}
</script>
<style>
@import "../assets/clasament.css";
</style>
