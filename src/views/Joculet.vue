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
      <p class="instructiune">3. Click on the box that appeares as fast as you can</p>
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
    document.title = "GridFanHub | Reaction test game"
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
