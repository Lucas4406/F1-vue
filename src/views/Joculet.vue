<template>
    <br>
    <div class="reaction-wrapper">
        <p class="reaction-titlu">
            Jocul de reacție folosit de piloții de Formula 1
        </p>
        <br>
        <button type="button" class="btn btn-danger" @click="start" :disabled="isPlaying">Start</button>
        <br>
        <br>
        <Boxreactie v-if="isPlaying" :delay="delay" @sfarsit="endGame" />
        <div class="result-box" v-if="showResult">
            <Results :score="score"/>
        </div>
        <div class="timpi-tabel">
            <span v-if="textshow">Ultimul timp:</span>
            <span v-else>Rezultate:</span>
            <p v-for="timpi in timp.slice().reverse()" :key="timpi.id">{{timpi}} ms</p>
        </div>
        <div class="instructiuni" v-if="!isPlaying">
            <p class="instructiune">1. Apasă pe butonul <span style="color: red">"Start"</span></p>
            <p class="instructiune">2. Așteaptă câteva secunde</p>
            <p class="instructiune">3. Apasă pe cutiuța apărută</p>
            <p class="instructiune">4. Verifică scorul</p>
        </div>
        <div class="best-tabel" v-if="!textshow">
            <span>Cel mai bun timp:</span>
            <span style="font-weight: bold">{{maxim}} ms</span>
        </div>
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
    data() {
        return {
            isPlaying: false,
            delay: null,
            score: null,
            showResult: false,
            timp: [],
            textshow: true,
            maxim: 999999,
        };
    },
    mounted() {
        document.title = "Joc Reacție";
        if (localStorage.getItem('score')) {
            try {
                this.timp.push(localStorage.getItem('score'))
            } catch(e) {
                localStorage.removeItem('score');
            }
        }
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
            const parsed = JSON.stringify(this.score);
            localStorage.setItem('score', parsed);
            if (localStorage.getItem('score')) {
                try {
                    this.timp.push(localStorage.getItem('score'))
                    this.textshow = false
                } catch(e) {
                    localStorage.removeItem('score');
                }
            }
            for(var i = 0;i<this.timp.length;i++){
                if(this.maxim > this.timp[i]){
                    this.maxim = this.timp[i]
                }
            }
        }
    },
}
</script>
<style>
    @import "../assets/joc.css";
</style>
