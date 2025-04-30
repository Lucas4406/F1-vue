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
              <p alt="data" class="">{{ FP1.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ FP1.time }}
            </p>
          </div>
          <div alt="FP2" v-if="!Sprint.date" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>FP2</p>
              <p alt="data">{{ FP2.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ FP2.time }}
            </p>
          </div>
          <div alt="SprintQuali" v-if="Sprint.date" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>SprintQuali</p>
              <p alt="data">{{ SprintQuali.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ SprintQuali.time }}
            </p>
          </div>
          <div alt="Sprint" v-if="Sprint.date" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>Sprint</p>
              <p alt="data">{{ Sprint.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ Sprint.time }}
            </p>
          </div>
          <div alt="FP3" v-if="FP3.date" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>FP3</p>
              <p alt="data">{{ FP3.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ FP3.time }}
            </p>
          </div>
          <div alt="Quali" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>Quali</p>
              <p alt="data">{{ Quali.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ Quali.time }}
            </p>
          </div>
          <div alt="Cursa" class="flex justify-between">
            <div alt="parte-st" class="flex justify-between w-[50%]">
              <p>Cursă</p>
              <p alt="data">{{ Race.date }}</p>
            </div>
            <p alt="timp" class="w-[50%] flex justify-end items-center">
              {{ Race.time }}
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
                new Date(cursa.FirstPractice.date)
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                cursa.FirstPractice.date + "T" + cursa.FirstPractice.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                cursa.FirstPractice.date + "T" + cursa.FirstPractice.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="SprintQuali" v-if="cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p class="">SprintQuali</p>
            <p alt="data" class="">
              {{
                new Date(cursa.SprintQualifying.date)
                    .toISOString()
                    .replace(/T.*/, "")
                    .split("-")
                    .reverse()
                    .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                  cursa.SprintQualifying.date + "T" + cursa.SprintQualifying.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                  cursa.SprintQualifying.date + "T" + cursa.SprintQualifying.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="FP2" v-if="!cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>FP2</p>
            <p alt="data">
              {{
                new Date(cursa.SecondPractice.date)
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                cursa.SecondPractice.date + "T" + cursa.SecondPractice.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                cursa.SecondPractice.date + "T" + cursa.SecondPractice.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="Sprint" v-if="cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>Sprint</p>
            <p alt="data">
              {{
                new Date(cursa.Sprint.date)
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                cursa.Sprint.date + "T" + cursa.Sprint.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                cursa.Sprint.date + "T" + cursa.Sprint.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="FP3" v-if="!cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>FP3</p>
            <p alt="data">
              {{
                new Date(cursa.ThirdPractice.date)
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                cursa.ThirdPractice.date + "T" + cursa.ThirdPractice.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                cursa.ThirdPractice.date + "T" + cursa.ThirdPractice.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="Quali" v-if="cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p class="">Quali</p>
            <p alt="data" class="">
              {{
                new Date(cursa.Qualifying.date)
                    .toISOString()
                    .replace(/T.*/, "")
                    .split("-")
                    .reverse()
                    .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                  cursa.Qualifying.date + "T" + cursa.Qualifying.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                  cursa.Qualifying.date + "T" + cursa.Qualifying.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="Quali" v-if="!cursa.Sprint" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>Quali</p>
            <p alt="data">
              {{
                new Date(cursa.Qualifying.date)
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("-")
              }}
            </p>
          </div>
          <p alt="timp" class="w-[50%] flex justify-end items-center">
            {{
              new Date(
                cursa.Qualifying.date + "T" + cursa.Qualifying.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
              " " +
              "-" +
              " " +
              add1(
                cursa.Qualifying.date + "T" + cursa.Qualifying.time
              ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
            }}
          </p>
        </div>
        <div alt="Cursa" class="flex justify-between">
          <div alt="parte-st" class="flex justify-between w-[50%]">
            <p>Cursă</p>
            <p alt="data">
              {{
                new Date(cursa.date)
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("-")
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
import { useCounterStore } from '@/stores.js'
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
      FP1: {
        date: "",
        time: "",
      },
      FP2: {
        date: "",
        time: "",
      },
      FP3: {
        date: "",
        time: "",
      },
      Sprint: {
        date: "",
        time: "",
      },
      SprintQuali: {
        date: "",
        time: "",
      },
      Quali: {
        date: "",
        time: "",
      },
      Race: {
        date: "",
        time: "",
      },
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
      var link1 = `${import.meta.env.VITE_API_LINK}/get-next`
      const res = await axios.get(link1)
      const cursaActuala = res.data.seasonContext.seasonContextUIState
      const counter = useCounterStore()
      const resData1 = counter.count

      var link = "https://api.jolpi.ca/ergast/f1/2025/races.json?limit=100"
      const response = await axios.get(link)
      const resData = response.data.MRData.RaceTable.Races
      this.curse = resData
      const idcurent = resData[cursaActuala].Circuit.circuitId
      var i
      for (i = 0; i < resData.length; i++) {
        if (resData[i].Circuit.circuitId.toLowerCase() === idcurent) {
          this.idCurent = i
        }
      }
      this.hero = this.curse[cursaActuala]



      this.circuitName =
        this.hero.Circuit.circuitId.charAt(0).toUpperCase() +
        this.hero.Circuit.circuitId.slice(1).replace(/_/g, " ")
      this.round = this.hero.round
      this.FP1.date = new Date(this.hero.FirstPractice.date)
        .toISOString()
        .replace(/T.*/, "")
        .split("-")
        .reverse()
        .join("-")
      this.FP1.time =
        new Date(
          this.hero.FirstPractice.date + "T" + this.hero.FirstPractice.time
        ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
        " " +
        "-" +
        " " +
        add1Hour(
          this.hero.FirstPractice.date + "T" + this.hero.FirstPractice.time
        ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      if (this.hero.ThirdPractice) {
        this.FP2.date = new Date(this.hero.SecondPractice.date)
            .toISOString()
            .replace(/T.*/, "")
            .split("-")
            .reverse()
            .join("-")
        this.FP2.time =
            new Date(
                this.hero.SecondPractice.date + "T" + this.hero.SecondPractice.time
            ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
            " " +
            "-" +
            " " +
            add1Hour(
                this.hero.SecondPractice.date + "T" + this.hero.SecondPractice.time
            ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      }
      if (this.hero.ThirdPractice) {
        this.FP3.date = new Date(this.hero.ThirdPractice.date)
          .toISOString()
          .replace(/T.*/, "")
          .split("-")
          .reverse()
          .join("-")
        this.FP3.time =
          new Date(
            this.hero.ThirdPractice.date + "T" + this.hero.ThirdPractice.time
          ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
          " " +
          "-" +
          " " +
          add1Hour(
            this.hero.ThirdPractice.date + "T" + this.hero.ThirdPractice.time
          ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      }
      if (this.hero.Sprint) {
        this.Sprint.date = new Date(this.hero.Sprint.date)
          .toISOString()
          .replace(/T.*/, "")
          .split("-")
          .reverse()
          .join("-")
        this.Sprint.time =
          new Date(
            this.hero.Sprint.date + "T" + this.hero.Sprint.time
          ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
          " " +
          "-" +
          " " +
          add1Hour(
            this.hero.Sprint.date + "T" + this.hero.Sprint.time
          ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      }
      if (this.hero.SprintQualifying) {
        this.SprintQuali.date = new Date(this.hero.SprintQualifying.date)
            .toISOString()
            .replace(/T.*/, "")
            .split("-")
            .reverse()
            .join("-")
        this.SprintQuali.time =
            new Date(
                this.hero.SprintQualifying.date + "T" + this.hero.SprintQualifying.time
            ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
            " " +
            "-" +
            " " +
            add1Hour(
                this.hero.Sprint.date + "T" + this.hero.Sprint.time
            ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      }
      this.Quali.date = new Date(this.hero.Qualifying.date)
        .toISOString()
        .replace(/T.*/, "")
        .split("-")
        .reverse()
        .join("-")
      this.Quali.time =
        new Date(
          this.hero.Qualifying.date + "T" + this.hero.Qualifying.time
        ).toLocaleTimeString("ro-RO", { timeStyle: "short" }) +
        " " +
        "-" +
        " " +
        add1Hour(
          this.hero.Qualifying.date + "T" + this.hero.Qualifying.time
        ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      this.Race.date = new Date(this.hero.date)
        .toISOString()
        .replace(/T.*/, "")
        .split("-")
        .reverse()
        .join("-")
      this.Race.time = new Date(
        this.hero.date + "T" + this.hero.time
      ).toLocaleTimeString("ro-RO", { timeStyle: "short" })
      this.Name = this.hero.raceName

      function add1Hour(timp1) {
        var test = new Date(timp1)
        var x = test.getTime()
        var hour1 = new Date(x + 60 * 60 * 1000)
        return hour1
      }
      this.show = true
    },
    add1(timpinceput) {
      var test = new Date(timpinceput)
      var x = test.getTime()
      var timpscos = new Date(x + 60 * 60 * 1000)
      return timpscos
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
