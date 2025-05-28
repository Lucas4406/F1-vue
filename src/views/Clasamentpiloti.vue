<template>
  <div class="content-wrapper">
    <br />
    <p class="piloti-text">Formula 1 Driver standings 2025</p>
    <br />
    <br />
    <div class="piloti-grid">
      <router-link
        class="pilot-container"
        v-for="(pilot, index) in piloti"
        :key="index"
        :to="{ name: 'Pilotdetails', params: { id: pilot.alDoileaNume.slice(0, 3).toUpperCase() } }"
      >
        <div class="pozitiepuncte-pilot">
          <p class="pozitie-pilot" v-if="!dontShow">{{ pilot.pozitie }}</p>
          <div class="nrpuncte-container" v-if="!dontShow">
            <p class="nrpuncte-pilot">{{ pilot.puncte }}</p>
            <p class="puncte-text-pilot">PTS</p>
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
          <img :src="pilot.poza" class="poza-pilot"  />
          <img :src="pilot.numar" class="nr-pilot"  />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import {useHead} from "@vueuse/head";

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
    useHead({
      title: "GridFanHub | Formula 1 Driver Standings 2025",
      meta: [
        {
          name: "description",
          content:
              "Stay updated with the latest 2025 Formula 1 driver standings. View positions, points, gaps and more for each F1 driver this season.",
        },
        {
          name: "keywords",
          content:
              "F1 2025 standings, Formula 1 drivers 2025, F1 driver points, F1 ranking 2025, F1 drivers table, Formula 1 drivers gap, F1 points 2025",
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          property: "og:title",
          content: "GridFanHub | Formula 1 Driver Standings 2025",
        },
        {
          property: "og:description",
          content:
              "Check out the full Formula 1 2025 driver standings, updated after every race. Discover driver positions, points, and gaps to the leader.",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: "https://gridfanhub.com/drivers",
        },
        {
          property: "og:image",
          content: "https://gridfanhub.com/favicon.ico", // modifică cu imaginea OG reală
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: "GridFanHub | Formula 1 Driver Standings 2025",
        },
        {
          name: "twitter:description",
          content:
              "Explore the complete driver standings for the 2025 F1 season on GridFanHub. Updated after every race weekend.",
        },
        {
          name: "twitter:image",
          content: "https://gridfanhub.com/favicon.ico", // modifică cu imaginea reală
        },
      ],
      link: [
        {
          rel: "canonical",
          href: "https://gridfanhub.com/drivers",
        },
      ],
    })
  },
}
</script>

<style scoped>
@import "../assets/clasamentpiloti.scss";
</style>
