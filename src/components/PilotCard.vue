<template>
  <router-link
      to="/drivers"
    class="card-const text-inherit no-underline hover:no-underline"
    :class="{ darkmode: darkMode }"
    :style="{ borderColor: pilot.culoare }"
  >
    <div class="partesus">
      <p
        class="pozitie"
        :style="{ borderColor: pilot.culoare }"
        id="pozitie"
        :class="{ darkmode: darkMode }"
      >
        {{ pilot.pozitie === null ? 0 : pilot.pozitie }}
      </p>
      <p class="nume-echipa" id="numeEchipa">
        {{ pilot.primulNume + " " + pilot.alDoileaNume }}
      </p>
    </div>
    <div class="partejos">
      <div
        class="curse-castigate-cont"
        :style="{ borderColor: pilot.culoare }"
        :class="{ darkmode: darkMode }"
      >
        <p class="text-curse">Team</p>
        <p class="curse-castigate" id="curseCastigate">
          {{ pilot.echipa }}
        </p>
      </div>
      <div
        class="nrpuncte-cont"
        :class="{ darkmode: darkMode }"
        :style="{ borderColor: pilot.culoare }"
      >
        <p class="text-puncte">Points</p>
        <p class="nrpuncte" id="nrpuncte">
          {{ pilot.puncte === null ? 0 : pilot.puncte }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["pilot", "darkMode"],
}
</script>

<style scoped>
.curse-castigate {
  font-size: 2rem;
  padding: 0.5rem;
  text-align: center;
}
.nume-echipa {
  text-align: center;
}
</style>
