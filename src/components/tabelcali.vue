<template>
  <div class="tabel-container" :class="{ darkmode: darkMode }">
    <div class="tabel">
      <div class="nume-cursa">{{ qualiData.raceName }}</div>
      <div class="data-cursa">
        {{
          new Date(qualiData.date)
            .toISOString()
            .replace(/T.*/, "")
            .split("-")
            .reverse()
            .join("-")
        }}
      </div>
      <div class="loc-cursa">{{ qualiData.Circuit.Location.country }}</div>
      <div class="laptime">
        <div class="gol"></div>
        <div class="q-container">
          <p class="quri q1" id="q1" :class="{ darkmode: darkMode }">Q1</p>
          <p class="quri" id="q2">Q2</p>
          <p class="quri" id="q3">Q3</p>
        </div>
      </div>
      <div
        class="piloti-container"
        v-for="pilot in qualiData.QualifyingResults"
        :key="pilot.id"
        ref="pilot"
      >
        <div class="pilot">
          <div class="parte-stanga">
            {{ pilot.position }}. {{ pilot.Driver.givenName }}
            {{ pilot.Driver.familyName }}
            <span
              ><img src="/First-Place-PNG-Picture.png" class="poza-cali"
            /></span>
          </div>
          <div class="parte-dreapta">
            <div class="timp-container" id="q1">{{ pilot.Q1 }}</div>
            <div class="timp-container" id="q2">{{ pilot.Q2 }}</div>
            <div class="timp-container" id="q3">{{ pilot.Q3 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["darkMode", "qualiData"],
}
</script>

<style scoped>
@import "../assets/calificari.css";
</style>
