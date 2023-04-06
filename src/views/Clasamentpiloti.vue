<template>
  <div class="content-wrapper">
    <br />
    <p class="piloti-text">Clasament piloți 2023</p>
    <br />
    <br />
    <div class="piloti-grid">
      <router-link
        class="pilot-container"
        v-for="(pilot, index) in piloti"
        :key="index"
        :to="{ name: 'Pilotdetails', params: { id: pilot.driver_id } }"
      >
        <div class="pozitiepuncte-pilot">
          <p class="pozitie-pilot" v-if="!dontShow">{{ pilot.pozitie }}</p>
          <div class="nrpuncte-container" v-if="!dontShow">
            <p class="nrpuncte-pilot">{{ pilot.puncte }}</p>
            <p class="puncte-text-pilot">PCT</p>
          </div>
        </div>
        <div class="numesteag">
          <div class="numesiculoare">
            <p class="culoare-pilot-pilot" :style="{ color: pilot.culoare }">
              |
            </p>
            <div class="nume-pilot">
              <p class="firstname">{{ pilot.primulNume }}</p>
              <p class="lastname">{{ pilot.alDoileaNume }}</p>
            </div>
          </div>
          <img :src="pilot.steag" class="img-steag" />
        </div>
        <div class="flex flex-row justify-between items-center">
          <p class="echipa">
            {{ pilot.echipa }}
          </p>
          <p class="echipa" v-if="!dontShow">{{ pilot.gapDelta }}</p>
        </div>
        <div class="pozanumar">
          <img :src="pilot.poza" class="poza-pilot" />
          <img :src="pilot.numar" class="nr-pilot" />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "CLasamentpiloti",
  inject: ["store"],
  data() {
    return {
      piloti: [],
      dontShow: false,
    }
  },
  mounted() {
    fetch(`${import.meta.env.VITE_API_LINK}/mongo/piloti?order=asc`)
      .then((res) => res.json())
      .then((data) => {
        var first = data[0].puncte
        var firstThree = data[0].alDoileaNume.substring(0, 3).toUpperCase()
        data[0].gapDelta = ""
        for (var i = 1; i < data.length; i++) {
          var delta = first - data[i].puncte
          if (delta < 300) {
            data[i].gapDelta = `Gap to ${firstThree} ` + JSON.stringify(-delta)
          } else {
            data[i].gapDelta = ""
          }

          if (data[i].pozitie === null || data[i].puncte === null) {
            this.dontShow = true
          }
        }
        this.piloti = data
      })
      .catch((err) => console.log(err))
    document.title = "Clasament piloți"
  },
}
</script>

<style scoped>
@import "../assets/clasamentpiloti.scss";
</style>
