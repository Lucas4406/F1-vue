<template>
    <br>
    <div class="reaction-wrapper">
        <p class="reaction-titlu">
            Jocul de reacție folosit de piloții de Formula 1
        </p>
        <br>
        <button class="start-button" @click="start" :disabled="isPlaying">Start</button>
        <br>
        <br>
        <Boxreactie v-if="isPlaying" :delay="delay" @sfarsit="endGame" />
        <Results v-if="showResult" :score="score"/>
    </div>
</template>
<script>
import Boxreactie from "../components/Boxreactie.vue"
import Results from "../components/results.vue"
export default{
    name: "joc",
    components: {
    Boxreactie,
    Results,
},
    mounted() {
        document.title = "Joc Reacție";
    },
    data() {
        return {
            isPlaying: false,
            delay: null,
            score: null,
            showResult: false
        };
    },
    methods: {
        start() {
            this.delay = 2000 + Math.random() * 2000,
            this.isPlaying = true;
            this.showResult = false
        },
        endGame (timpReactie) {
            this.score = timpReactie
            this.isPlaying = false
            this.showResult = true
        }
    },
}
</script>
<style>
    @import "../assets/joc.css";
</style>
