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
            <img src="/Favico.svg" class="w-6 h-6 pozaFav" alt="Icon echipă favorită" />
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
          <img :src="echipa.logo" class="poza1" :alt="`Logo ${echipa.name}`" />
        </div>
      </div>
      <div class="linie3">
        <img :src="echipa.masinaPoza" class="poza" :alt="`Mașina ${echipa.name}`" />
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, inject } from "vue"
import { useHead } from "@vueuse/head"
import { makeRequest } from "../functions/makeRequest"

export default {
  name: "Echipe",
  setup() {
    const echipe = ref([])
    const echipaFav = ref("")
    const ok = ref("")
    const puncteNull = ref(false)
    const store = inject("store")

    const setHead = (year) => {
      useHead({
        title: `Formula 1 Teams ${year}`,
        meta: [
          {
            name: "description",
            content: `See the teams participating in the Formula 1 ${year} season, including drivers and updated points.`,
          },
          {
            property: "og:title",
            content: `Formula 1 Teams ${year}`,
          },
          {
            property: "og:description",
            content: `Current team standings for the Formula 1 ${year} season.`,
          },
        ],
      });
    };

    const getTeams = async () => {
      const data = await makeRequest(`${import.meta.env.VITE_API_LINK}/mongo/teams/all`)
      echipe.value = data

      const year = new Date(data[0].createdAt).getFullYear()
      setHead(year)

      for (let i = 0; i < data.length; i++) {
        if (data[i].nrpuncte === null) {
          puncteNull.value = true
        }
      }

      if (store.user != null) {
        let fav = store.user.favTeam
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === fav) {
            ok.value = i
          }
        }
      }
    }

    onMounted(() => {
      getTeams()
    })

    return {
      echipe,
      echipaFav,
      ok,
      puncteNull,
    }
  },
}
</script>

<style scoped>
@import "../assets/content-echipe.css";
</style>
