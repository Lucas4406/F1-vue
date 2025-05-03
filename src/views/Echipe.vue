<template>
  <div class="content-echipe" id="echipeCont">
    <div
      class="box"
      :class="[
        echipa.name.replace(/\s+/g, ''),
        { echipaFavorita: ok === index },
      ]"
      v-for="(echipa, index) in echipe"
      :key="index"
    >
      <div class="linie1">
        <div class="linie flex flex-row items-center gap-2" id="numar">
          <div class="">
            {{ echipa.pozitie }}
          </div>
          <div class="flex Favcontainer">
            <img src="/Favico.svg" class="w-6 h-6 pozaFav" />
          </div>
        </div>
        <div class="numee">
          {{ echipa.name }}
        </div>
        <div class="points">
          <div class="points-number">
            {{ echipa.nrpuncte }}
          </div>
          <div class="inverted-pts" v-if="!puncteNull">PTS</div>
        </div>
      </div>
      <div class="linie2">
        <div class="numepilot">
          {{
            echipa.pilot_1
          }}
        </div>
        <div class="numepilot">
          {{
            echipa.pilot_2
          }}
        </div>
        <div class="pozae">
          <img :src="echipa.logo" class="poza1" />
        </div>
      </div>
      <div class="linie3">
        <img :src="echipa.masinaPoza" class="poza" />
      </div>
    </div>
  </div>
</template>
<script>
import { makeRequest } from "../functions/makeRequest"
export default {
  inject: ["store"],
  name: "Echipe",
  data() {
    return {
      echipe: [],
      echipaFav: "",
      ok: "",
      puncteNull: false,
    }
  },
  mounted() {
    document.title = "Echipe"
    this.getTeams()
  },
  methods: {
    async getTeams() {
      const data = await makeRequest(
        `${import.meta.env.VITE_API_LINK}/mongo/teams/all`
      )
      this.echipe = data
      const an_prezent = new Date(data[0].createdAt).getFullYear()
      document.title = `Echipe ${an_prezent}`
      for (var i = 0; i < data.length; i++) {
        if (data[i].nrpuncte === null) {
          this.puncteNull = true
        }
      }
      if (this.store.user != null) {
        let fav = this.store.user.favTeam
        for (var i = 0; i < data.length; i++) {
          if (data[i].name === fav) {
            this.ok = i
          }
          if (data[i].nrpuncte === null) {
            this.puncteNull = true
          }
        }
      }
    },
  },
}
</script>

<style scoped>
@import "../assets/content-echipe.css";
</style>
