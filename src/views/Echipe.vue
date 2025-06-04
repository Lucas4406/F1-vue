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
          <div class="team-name-main">{{ echipa.name }}</div>
          <div class="team-extra-info">
            <div v-if="echipa.curseCastigate !== null && echipa.curseCastigate !== undefined" class="races-won-info source">
              Races won: {{ echipa.curseCastigate }}
            </div>
            <div v-if="echipa.liked_by > 0" class="liked-by-info source">
              Liked by: {{ echipa.liked_by }}
            </div>
          </div>
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
        title: `GridFanHub | Formula 1 Teams ${year}`,
        meta: [
          {
            name: "description",
            content: `Discover all Formula 1 teams from the ${year} season, with updated points, drivers, cars, and logos only on GridFanHub.`,
          },
          {
            name: "keywords",
            content:
                "F1 2025 teams, Formula 1 teams, F1 constructors, F1 team standings 2025, F1 car photos, F1 logos, F1 team drivers 2025, formula1, gridfanhub drivers, mercedes, red bull, ferrari, alpine, williams, alex albon, aston martin, lewis hamilton, max verstappen, charles leclerc, oscar piastri, lando norris, fernando alonso, f1 points, standings updated constantly, f1 number of points, favourite team",
          },
          {
            name: "robots",
            content: "index, follow",
          },
          {
            property: "og:title",
            content: `GridFanHub | Formula 1 Teams ${year}`,
          },
          {
            property: "og:description",
            content: `Explore the complete list of Formula 1 teams in the ${year} season, including team standings, driver pairings, and car designs.`,
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:url",
            content: "https://gridfanhub.com/teams",
          },
          {
            property: "og:image",
            content: "https://gridfanhub.com/favicon.ico", // înlocuiește cu imaginea reală OG
          },
          {
            name: "twitter:card",
            content: "summary_large_image",
          },
          {
            name: "twitter:title",
            content: `GridFanHub | Formula 1 Teams ${year}`,
          },
          {
            name: "twitter:description",
            content: `Get up-to-date information about all Formula 1 teams from the ${year} season on GridFanHub.`,
          },
          {
            name: "twitter:image",
            content: "https://gridfanhub.com/favicon.ico", // înlocuiește cu imaginea reală OG
          },
        ],
        link: [
          {
            rel: "canonical",
            href: "https://gridfanhub.com/teams",
          },
        ],
      });
    }

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
.numee {
  /* display: flex; */ /* This should already be there from your original .numee */
  flex-direction: column; /* This is key: stacks the name and extra info vertically */
  /* justify-content: center; */ /* Should be there */
  /* align-items: center; */   /* Should be there */
  /* font-size: 2.5rem; */     /* Existing */
  /* font-weight: 600; */    /* Existing */
  text-align: center; /* Ensures all text lines within .numee are centered */
}

.team-name-main {
  /* If you need to adjust the main team name specifically, style this class. */
  /* Otherwise, it will inherit/use .numee's font styles. */
}

.team-extra-info {
  margin-top: 0.3rem; /* Adds a small space below the team name */
  font-size: 0.9rem;  /* Smaller font size for the stats to make them subordinate */
  font-weight: 400;   /* Normal font weight, less than the team name */
  line-height: 1.4;   /* Adjust for readability if both stats appear */
  color: #333333;     /* Slightly less prominent color, adjust to your theme */
}

.races-won-info,
.liked-by-info {
  /* If they both appear, they will stack vertically due to being divs. */
  /* You can add a little margin between them if needed: */
  /* For example, if .races-won-info is followed by .liked-by-info */
}

.races-won-info + .liked-by-info {
  margin-top: 0.2rem; /* Small space between "Races won" and "Liked by" if both are shown */
}

/* Adjustments for smaller screens if needed, within your existing @media query */
@media (max-width: 1200px) {
  .numee {
    /* font-size: 3rem; /* Existing */
  }
  .team-extra-info {
    font-size: 1rem; /* Slightly larger on smaller screens if desired, or keep as is */
  }
}
</style>
