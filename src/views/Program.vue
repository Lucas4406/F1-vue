<template>
  <!-- Cursa Urmatoare -->
  <ProgramHero
      v-if="show"
      :hero="hero"
      :round="round"
      :circuitName="circuitName"
      :Name="Name"
      :getItem="getItem"
  />
  <!-- Card Grid -->
  <div
    class="lg:grid lg:grid-cols-2 md:grid-cols-1 lg:px-14 lg:p-6 lg:gap-6 sm:justify-center sm:flex sm:flex-col sm:gap-6"
  >
    <router-link
      class="border-black border-2 border-solid sm:max-w-xl lg:max-w-4xl p-4 sm:ml-20 md:ml-24 lg:ml-0 rounded-md animatie text-black"
      v-for="(cursa, index) in curse"
      :key="index"
      :id="cursa.Circuit.circuitId.replace(/_/g, '')"
      :class="{ cursaCurenta: idCurent === index }"
      :to="{ name: 'Meeting', params: {an: cursa.season ,  meeting_name: cursa.raceName.replace(/\s+/g, '_') } }"
    >
      <div class="flex justify-between text-2xl mb-4 font-bold">
        <p >{{ cursa.round }}. {{ cursa.raceName }}</p>
        <p >
          {{
            cursa.Circuit.circuitId.charAt(0).toUpperCase() +
            cursa.Circuit.circuitId.slice(1).replace(/_/g, " ")
          }}
        </p>
      </div>
      <div class="text-2xl gap-2 flex flex-col">
        <div  class="flex justify-between">
          <div  class="flex justify-between w-[50%]">
            <p class="">FP1</p>
            <p  class="">
              {{
                this.formatDate(cursa.FirstPractice.date)
              }}
            </p>
          </div>
          <p class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.FirstPractice , 60).timpul
            }}
          </p>
        </div>
        <div v-if="cursa.Sprint" class="flex justify-between">
          <div class="flex justify-between w-[50%]">
            <p class="">SprintQuali</p>
            <p  class="">
              {{
                this.formatDate(cursa.SprintQualifying.date)
              }}
            </p>
          </div>
          <p  class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.SprintQualifying , 44).timpul
            }}
          </p>
        </div>
        <div v-if="!cursa.Sprint" class="flex justify-between">
          <div  class="flex justify-between w-[50%]">
            <p>FP2</p>
            <p >
              {{
                this.formatDate(cursa.SecondPractice.date)
              }}
            </p>
          </div>
          <p  class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.SecondPractice , 60).timpul
            }}
          </p>
        </div>
        <div  v-if="cursa.Sprint" class="flex justify-between">
          <div  class="flex justify-between w-[50%]">
            <p>Sprint</p>
            <p>
              {{
                this.formatDate(cursa.Sprint.date)
              }}
            </p>
          </div>
          <p class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.Sprint , 60).timpul
            }}
          </p>
        </div>
        <div v-if="!cursa.Sprint" class="flex justify-between">
          <div class="flex justify-between w-[50%]">
            <p>FP3</p>
            <p>
              {{
                this.formatDate(cursa.ThirdPractice.date)
              }}
            </p>
          </div>
          <p class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.ThirdPractice , 60).timpul
            }}
          </p>
        </div>
        <div class="flex justify-between">
          <div class="flex justify-between w-[50%]">
            <p>Quali</p>
            <p>
              {{
                this.formatDate(cursa.Qualifying.date)
              }}
            </p>
          </div>
          <p class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.Qualifying , 60).timpul
            }}
          </p>
        </div>
        <div class="flex justify-between">
          <div class="flex justify-between w-[50%]">
            <p>Cursă</p>
            <p>
              {{
                this.formatDate(cursa.date)
              }}
            </p>
          </div>
          <p class="w-[50%] flex justify-end items-center">
            {{
              new Date(cursa.date + "T" + cursa.time).toLocaleTimeString(
                "ro-RO",
                { timeStyle: "short" }
              )
            }}
          </p>
        </div>
      </div>
    </router-link>
  </div>
  <Calendar v-if="show === true" :races="curse" />
</template>

<script>
import axios from "axios"
import getNext from "@/functions/getNext";
import Calendar from "@/components/Calendar.vue"
import {useHead} from "@vueuse/head";
import ProgramHero from "@/components/ProgramHero.vue"

export default {
  name: "Program",
  components: {
    Calendar,
    ProgramHero
  },
  data() {
    return {
      curse: [],
      hero: [],
      nr: "",
      circuitName: "",
      round: "",
      show: false,
      Name: "",
      idCurent: 0,
    }
  },
  mounted() {
    useHead({
      title: 'GridFanHub | Formula 1 Schedule 2025',
      meta: [
        { name: 'description', content: 'Complete Formula 1 2025 schedule: sessions, practice, qualifying, and race times — all in your local timezone. Updated live on GridFanHub.' },
        { property: 'og:title', content: ' GridFanHub | Formula 1 Schedule 2025' },
        { property: 'og:description', content: 'Check the full Formula 1 2025 race calendar with session details, local time conversions, and links to each race weekend.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://gridfanhub.com/schedule' },
        { property: 'og:image', content: 'https://gridfanhub.com/favicon.ico' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'GridFanHub | Formula 1 Schedule 2025' },
        { name: 'twitter:description', content: 'F1 2025 race calendar with full session times. All shown in your local timezone.' },
        { name: 'twitter:image', content: 'https://gridfanhub.com/favicon.ico' },
      ],
      link: [
        { rel: 'canonical', href: 'https://gridfanhub.com/schedule' }
      ]
    })
    this.getCurse()
  },
  methods: {
    async getCurse() {
      const res = await getNext
      const cursaActuala = res.meetingContext.nr_runda

      let link = "https://api.jolpi.ca/ergast/f1/2025/races.json?limit=100"
      const response = await axios.get(link)
      const resData = response.data.MRData.RaceTable.Races
      this.curse = resData
      for (let i = 0; i < resData.length; i++) {
        if (Number(resData[i].round) === (cursaActuala + 1) ) {
          this.idCurent = i
        }
      }
      this.hero = this.curse[cursaActuala]
      this.circuitName =
        this.hero.Circuit.circuitId.charAt(0).toUpperCase() +
        this.hero.Circuit.circuitId.slice(1).replace(/_/g, " ")
      this.round = this.hero.round
      this.Name = this.hero.raceName
      this.show = true
    },
    formatSession(session, extraMinutes) {
      if (!session?.date || !session?.time) return null;

      const startDateTime = new Date(session.date + "T" + session.time);
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + extraMinutes);

      const formattedDate = startDateTime
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-");

      const formattedTime =
          startDateTime.toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
          " - " +
          endDateTime.toLocaleTimeString("ro-RO", { timeStyle: "short" });

      return {
        data: formattedDate,
        timpul: formattedTime
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";

      return new Date(dateString)
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-");
    },
    getItem(ele) {
      const idul = document.querySelector(`${ele}`)
      idul.scrollIntoView({ behavior: "smooth" })
      window.scrollTo({
        top: document.querySelector(`${ele}`).offsetTop - 180,
      })
    },
  },
}
</script>

<style scoped>
.animatie {
  transition: transform 300ms ease-in-out;
}
.animatie:hover {
  transform: scale(1.02);
}
.cursaCurenta {
  border-color: red;
}
html {
  scroll-behavior: smooth;
}
</style>
