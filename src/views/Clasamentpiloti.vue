<template>
  <div class="antialiased  text-gray-800">
    <div class="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight source text-black">
          Formula 1 Driver Standings
        </h1>
        <p class="mt-2 text-lg text-gray-500 ">2025 Season</p>
      </div>

      <div class="piloti-grid">
        <router-link
            v-for="pilot in piloti"
            :key="pilot.pozitie || pilot.alDoileaNume"
            :to="{ name: 'Pilotdetails', params: { id: pilot.alDoileaNume.slice(0, 3).toUpperCase() } }"
            class="pilot-card group"
            :title="`View details for ${pilot.primulNume} ${pilot.alDoileaNume}`"
        >
          <div class="h-2 w-full" :style="{ backgroundColor: pilot.culoare }"></div>

          <div class="p-5 flex flex-col flex-grow relative z-10">
            <div class="flex justify-between items-start mb-4" v-if="!dontShow">
              <p class="text-6xl font-black text-gray-400  leading-none">
                {{ pilot.pozitie }}
              </p>
              <div class="flex items-center space-x-2" v-if="!dontShow">
                <div v-if="pilot.nr_fani > 0" class="flex items-center text-red-500 space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clip-rule="evenodd" />
                  </svg>
                  <span class="font-bold text-sm">{{ pilot.nr_fani }}</span>
                </div>
                <div class="flex items-center bg-gray-900 text-white rounded-full px-3 py-1 shadow-sm">
                  <span class="font-bold text-base tracking-tight">{{ pilot.puncte }}</span>
                  <span class="text-xs font-semibold ml-1.5 mt-px">PTS</span>
                </div>
              </div>
            </div>

            <div class="flex-grow">
              <p class="text-lg font-light text-gray-500  source">{{ pilot.primulNume }}</p>
              <p class="text-3xl font-extrabold text-gray-900  -mt-1.5 tracking-tight source">
                {{ pilot.alDoileaNume }}
              </p>
              <div class="flex justify-between items-center mt-3">
                <p class="text-base font-semibold text-gray-600  source">{{ pilot.echipa }}</p>
                <img :src="pilot.steag" class="h-6 w-auto rounded-sm border border-gray-200 " alt="Driver flag" />
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-gray-100  text-gray-500 font-medium">
              <div class="flex justify-between items-center h-6">
                <p v-if="pilot.gapDelta && !dontShow" class="bg-gray-100  rounded-md px-2 py-1">
                  {{ pilot.gapDelta }}
                </p>
                <p v-else class="flex-grow"></p>
              </div>
            </div>
          </div>

          <div class="absolute bottom-0 right-0 w-8/12 h-full pointer-events-none z-0">
            <img
                :src="pilot.poza"
                :alt="'Photo of ' + pilot.primulNume + ' ' + pilot.alDoileaNume"
                class="w-full h-full object-contain object-bottom drop-shadow-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        </router-link>
      </div>

      <p class="text-center font-bold text-gray-600  max-w-md mx-auto mt-16 source">
        To be counted in the 'Liked by' section, make an account and choose your favourite driver.
      </p>
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
          if (data.length === 0) return;
          var first = data[0].puncte
          var firstThree = data[0].alDoileaNume.substring(0, 3).toUpperCase()
          data[0].gapDelta = ""
          for (var i = 1; i < data.length; i++) {
            var delta = first - data[i].puncte
            if (delta < 300) { // Assuming you want to show a gap only within a certain range
              data[i].gapDelta = `Gap to ${firstThree}: ` + JSON.stringify(-delta)
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

    // Your useHead metadata remains unchanged
    useHead({
      title: "GridFanHub | Formula 1 Drivers 2025",
      meta: [
        {
          name: "description",
          content:
              "Stay updated with the latest 2025 Formula 1 driver standings on GridFanHub. View positions, points, gaps and more for each F1 driver this season.",
        },
        {
          name: "keywords",
          content:
              "F1 2025 standings, Formula 1 drivers 2025, F1 driver points, F1 ranking 2025, F1 drivers table, Formula 1 drivers gap, F1 points 2025, gridfanhub drivers, gridfanhub, f1, formula1, piloti formula 1 , piloti gridfanhub, f1 driver standings, f1 all drivers, lewis hamilton, max verstappen, george russell, kimi antonelli, charles leclrec, lando norris, oscar piastri, red bull, mercedes, fernando alonso, alex albon, carlos sainz, franco colapinto f1 updated points, updated drivers",
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
              "Check out the full Formula 1 2025 driver standings on GridFanHub, updated after every race. Discover driver positions, points, and gaps to the leader.",
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
.piloti-grid {
  display: grid;
  /* This creates a responsive grid that shows 1, 2, or 3 columns depending on screen width */
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.75rem; /* 28px */
}

.pilot-card {
  /* Using @apply to compose Tailwind utilities into a single class */
  /* Added 'relative' for positioning child elements and 'dark:' variants */
  @apply relative bg-white rounded-2xl shadow-lg flex flex-col no-underline
  transition-all duration-300 ease-in-out
  hover:shadow-2xl hover:-translate-y-2;

  /* Fallback for environments where @apply might not be processed */
  text-decoration: none;
  color: inherit;
  overflow: hidden; /* Ensures the top color bar doesn't break the border-radius */
}
</style>