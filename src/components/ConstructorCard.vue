<template>
  <router-link to="/teams" class="card-const text-inherit no-underline hover:no-underline" :class="{ darkmode: darkMode }">
    <div class="partesus">
      <p class="pozitie" id="pozitie" :class="{ darkmode: darkMode }">
        {{ team.position }}
      </p>
      <p class="nume-echipa" id="numeEchipa">{{ team.Constructor.name }}</p>
    </div>
    <div class="partejos">
      <div class="curse-castigate-cont" :class="{ darkmode: darkMode }">
        <p class="text-curse">Races won</p>
        <p class="curse-castigate" id="curseCastigate">{{ team.wins }}</p>
      </div>
      <div class="nrpuncte-cont" :class="{ darkmode: darkMode }">
        <p class="text-puncte">Points</p>
        <p class="nrpuncte" id="nrpuncte">{{ team.points }}</p>
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
