<template>
  <!-- Cursa Urmatoare -->
  <div
    class="mt-6 flex justify-center w-screen sm:mb-6 lg:mb-0"
    id="hero"
    alt="hero"
    v-if="show"
  >
    <div
      class="border-red-500 border-2 border-solid sm:max-w-xl sm:w-xl lg:max-w-4xl lg:w-4xl p-4 rounded-md w-[100%] animatie"
    >
      <a
        @click="
          getItem(`#${circuitName.replace(/\s/g, '').toLocaleLowerCase()}`)
        "
        style="text-decoration: none; color: black"
      >
        <div alt="header" class="flex justify-between text-2xl mb-4 font-bold">
          <p alt="titlu">{{ round }}. {{ Name }}</p>
          <p alt="circuit">{{ circuitName }}</p>
        </div>
        <div alt="data-wrapper" class="text-2xl gap-2 flex flex-col">
          <div alt="FP1" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p class="">FP1</p>
              <p alt="data" class="">{{ this.formatDate(this.hero.FirstPractice.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ this.formatSession(this.hero.FirstPractice , 60).timpul }}
            </p>
          </div>
          <div alt="FP2" v-if="!this.hero.Sprint" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>FP2</p>
              <p alt="data">{{ this.formatDate(this.hero.SecondPractice.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ this.formatSession(this.hero.SecondPractice , 60).timpul }}
            </p>
          </div>
          <div alt="SprintQuali" v-if="this.hero.Sprint" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>SprintQuali</p>
              <p alt="data">{{ this.formatDate(this.hero.SprintQualifying.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ this.formatSession(this.hero.SprintQualifying , 44).timpul }}
            </p>
          </div>
          <div alt="Sprint" v-if="this.hero.Sprint" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>Sprint</p>
              <p alt="data">{{ this.formatDate(this.hero.Sprint.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ this.formatSession(this.hero.Sprint , 60).timpul }}
            </p>
          </div>
          <div alt="FP3" v-if="!this.hero.Sprint" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>FP3</p>
              <p alt="data">{{ this.formatDate(this.hero.ThirdPractice.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ this.formatSession(this.hero.ThirdPractice , 60).timpul }}
            </p>
          </div>
          <div alt="Quali" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>Quali</p>
              <p alt="data">{{ this.formatDate(this.hero.Qualifying.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ this.formatSession(this.hero.Qualifying , 60).timpul }}
            </p>
          </div>
          <div alt="Cursa" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>Cursă</p>
              <p alt="data">{{ this.formatDate(this.hero.date) }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ new Date(this.hero.date + "T" + this.hero.time).toLocaleTimeString(
                "ro-RO",
                { timeStyle: "short" }
            ) }}
            </p>
          </div>
        </div>
      </a>
    </div>
  </div>
  <!-- Card Grid -->
  <div
    alt="card-grid"
    class="lg:grid lg:grid-cols-2 md:grid-cols-1 lg:px-14 lg:p-6 lg:gap-6 sm:justify-center sm:flex sm:flex-col sm:gap-6"
  >
    <div
      class="border-black border-2 border-solid sm:max-w-xl lg:max-w-4xl p-4 sm:ml-20 md:ml-24 lg:ml-0 rounded-md animatie"
      v-for="(cursa, index) in curse"
      :key="index"
      :id="cursa.Circuit.circuitId.replace(/_/g, '')"
      :class="{ cursaCurenta: idCurent === index }"
    >
      <div alt="header" class="flex justify-between text-2xl mb-4 font-bold">
        <p alt="titlu">{{ cursa.round }}. {{ cursa.raceName }}</p>
        <p alt="circuit">
          {{
            cursa.Circuit.circuitId.charAt(0).toUpperCase() +
            cursa.Circuit.circuitId.slice(1).replace(/_/g, " ")
          }}
        </p>
      </div>
      <div alt="data-wrapper" class="text-2xl gap-2 flex flex-col">
        <div alt="FP1" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p class="">FP1</p>
            <p alt="data" class="">
              {{
                this.formatDate(cursa.FirstPractice.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.FirstPractice , 60).timpul
            }}
          </p>
        </div>
        <div alt="SprintQuali" v-if="cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p class="">SprintQuali</p>
            <p alt="data" class="">
              {{
                this.formatDate(cursa.SprintQualifying.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.SprintQualifying , 44).timpul
            }}
          </p>
        </div>
        <div alt="FP2" v-if="!cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>FP2</p>
            <p alt="data">
              {{
                this.formatDate(cursa.SecondPractice.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.SecondPractice , 60).timpul
            }}
          </p>
        </div>
        <div alt="Sprint" v-if="cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>Sprint</p>
            <p alt="data">
              {{
                this.formatDate(cursa.Sprint.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.Sprint , 60).timpul
            }}
          </p>
        </div>
        <div alt="FP3" v-if="!cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>FP3</p>
            <p alt="data">
              {{
                this.formatDate(cursa.ThirdPractice.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.ThirdPractice , 60).timpul
            }}
          </p>
        </div>
        <div alt="Quali" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>Quali</p>
            <p alt="data">
              {{
                this.formatDate(cursa.Qualifying.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              this.formatSession(cursa.Qualifying , 60).timpul
            }}
          </p>
        </div>
        <div alt="Cursa" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>Cursă</p>
            <p alt="data">
              {{
                this.formatDate(cursa.date)
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(cursa.date + "T" + cursa.time).toLocaleTimeString(
                "ro-RO",
                { timeStyle: "short" }
              )
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: "Program",
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
    document.title = "Program 2025"
    this.getCurse()
  },
  methods: {
    async getCurse() {
      let link_api = `${import.meta.env.VITE_API_LINK}/get-next`
      const res = await axios.get(link_api)
      const cursaActuala = res.data.nr_runda

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
