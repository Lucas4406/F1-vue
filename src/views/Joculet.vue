<template>
  <br />
  <div class="reaction-wrapper">
    <p class="reaction-titlu">
      Reaction test game used by real Formula 1 drivers
    </p>
    <br />
    <button
      type="button"
      class="btn btn-danger"
      @click="start"
      :disabled="isPlaying"
    >
      Start
    </button>
    <br />
    <br />
    <Boxreactie v-if="isPlaying" :delay="delay" @sfarsit="endGame" />
    <div class="instructiuni" v-if="!isPlaying">
      <p class="instructiune">
        1. Press the  <span style="color: red">"Start"</span> button
      </p>
      <p class="instructiune">2. Wait a few seconds (random)</p>
      <p class="instructiune">3. Click on the circle that appeares as fast as you can</p>
      <p class="instructiune">4. Check your score</p>
    </div>
    <div class="result-box" v-if="showResult">
      <Results :score="score" />
    </div>
    <div class="timpi-tabel">
      <span v-if="textshow">Last times:</span>
      <span v-else>Results:</span>
      <p v-for="timpi in timp.slice().reverse()" :key="timpi.id">
        {{ timpi }} ms
      </p>
    </div>
    <div class="best-tabel" v-if="!textshow">
      <span>Best time:</span>
      <span style="font-weight: bold">{{ maxim }} ms</span>
    </div>
  </div>
</template>
<script>
import { useHead } from "@vueuse/head"
import Boxreactie from "../components/Boxreactie.vue"
import Results from "../components/results.vue"
export default {
  name: "joc",
  components: {
    Boxreactie,
    Results,
  },
  data() {
    return {
      isPlaying: false,
      delay: null,
      score: null,
      showResult: false,
      timp: [],
      textshow: true,
      maxim: 999999,
    }
  },
  mounted() {
    useHead({
      title: "GridFanHub | Reaction test game",
      meta: [
        {
          name: "description",
          content:
              "Try the GridFanHub reaction test game used by real Formula 1 drivers. See how fast you can react!",
        },
        {
          name: "keywords",
          content:
              "F1 reaction test, reaction time game, Formula 1 reflex test, reaction test online, gridfanhub reaction, gridfanhub game, joc reactie f1, reacite formula 1, piloti formula 1, f1 pilots, f1, formula 1, f1 game",
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          property: "og:title",
          content: "GridFanHub | Reaction test game",
        },
        {
          property: "og:description",
          content:
              "Can you beat the reaction times of F1 drivers? Play the reflex game used in motorsport made by GridFanHub.",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: "https://gridfanhub.com/reaction-game",
        },
        {
          property: "og:image",
          content: "https://gridfanhub.com/favicon.ico",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:title",
          content: "GridFanHub | Reaction test game",
        },
        {
          name: "twitter:description",
          content:
              "Try the same GridFanHub reaction test game used by F1 drivers and track your fastest time!",
        },
        {
          name: "twitter:image",
          content: "https://gridfanhub.com/favicon.ico",
        },
      ],
      link: [
        {
          rel: "canonical",
          href: "https://gridfanhub.com/reaction-game",
        },
      ],
    })
    if (JSON.parse(localStorage.getItem("score"))) {
      try {
        this.timp.push(JSON.parse(localStorage.getItem("score")))
      } catch (e) {
        localStorage.removeItem("score")
      }
    }
  },
  methods: {
    start() {
      ;(this.delay = 2000 + Math.random() * 2000), (this.isPlaying = true)
      this.showResult = false
    },
    endGame(timpReactie) {
      this.score = timpReactie
      this.isPlaying = false
      this.showResult = true
      localStorage.setItem("score", JSON.stringify(this.score))
      if (localStorage.getItem("score")) {
        try {
          this.timp.push(JSON.parse(localStorage.getItem("score")))
          this.textshow = false
        } catch (e) {
          localStorage.removeItem("score")
        }
      }
      for (var i = 0; i < this.timp.length; i++) {
        if (this.maxim > this.timp[i]) {
          this.maxim = this.timp[i]
        }
      }
    },
  },
}
</script>
<style scoped>
@import "../assets/joc.css";
</style>
