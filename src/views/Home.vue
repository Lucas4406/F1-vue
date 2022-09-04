<template>
    <div class="site-wrapper" v-if="show">
        <br>
        <herocursa v-show="Hero" :dataInceput="dataInceput" :dataSfarsit="dataSfarsit" :lunaCursa="lunaCursa" :pozaHarta="pozaHarta" :imagineMare="imagineMare" :runda="runda" :steag="steag" :tara="tara"/>
        <div class="stiri" :class="{darkmode: darkMode}">
            <div class="titlu">
                <div>
                    <img src="/checker.webp" class="titlu-poza">
                </div>
                <div class="titlu-text">
                    Știri de ultimă oră
                </div>
                <div>
                    <img src="/checker.webp" class="titlu-poza">
                </div>
            </div>
        </div>
        <div class="scroll-btns">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
        </div>
        <div class="content-grid" :class="{darkmode: darkMode}">
            <a :href="stire.link" v-for="stire in news" v-bind:key="stire.id" class="ltag" :class="{darkmode: darkMode}">
                <div class="stire">
                    <div class="content-row">
                        <div class="content-text" :class="{darkmode: darkMode}">
                            <p class="text" id="stiretext">{{stire.titlu}}</p>
                        </div>
                        <div class="content-photo">
                            <img :src="stire.poza" class="photo" id="stirephoto">
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
    <div class="loading" v-if="!show">
        <ProgressSpinner />
    </div>
</template>
<script>
import axios from 'axios'
import herocursa from "../components/herocursa.vue"
export default {
    name: "Home",
    components : {
        herocursa,
    },
    data () {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            news: [],
            darkMode,
            dataInceput: "",
            dataSfarsit: "",
            lunaCursa: "",
            pozaHarta: "",
            imagineMare: "",
            runda: "",
            steag: "",
            tara: "",
            Hero: false,
            show:false,
            nrCursa: "",
        }
    },
    mounted () {
        document.title= "Acasă"
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        }
        this.getCursa() 
        this.fetchData()
    },
    methods: {
        darkModeToggle() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
            if(this.darkMode){
                document.body.classList.add("darkmode")
            }else{
                document.body.classList.remove("darkmode")
            } 
        },
        async getNext () {
            var link = "https://ergast.com/api/f1/2022/results.json?limit=1000"
            const response = await axios.get(link)
            const resData = response.data.MRData.RaceTable.Races.length + 2
            this.nrCursa = resData
        },
        async getCursa () {
            await this.getNext()
            var j= this.nrCursa
            var link = "https://f1-site-api.vercel.app/up-next/" + j
            const response = await axios.get(link)
            const resData = response.data
            this.dataInceput = resData.dataCursa1
            this.dataSfarsit = resData.dataCursa2
            this.lunaCursa = resData.lunaCursa
            this.pozaHarta = resData.harta
            this.imagineMare = resData.imagine
            this.runda = resData.runda
            this.steag = resData.steag
            this.tara = resData.tara
            this.Hero = true
        },
        async fetchData () {
            var j=0
            for(j=0;j<4;j++){
                var link = "https://f1-site-api.vercel.app/stiri-translate/" + j
                const response = await axios.get(link)
                const resData = response.data
                this.news[j] = resData
                if(this.news[2] !== null){
                    this.show=true
                }
            }
        },
    },
}
</script>

<style>
    @import "../assets/home.css";
    @import "../assets/dkmodebtn.css";

    @keyframes p-progress-spinner-color {
        100%,
        0% {
            stroke: #FF0000;
        }
        40% {
            stroke: #FF0000;
        }
        66% {
            stroke: #FF0000;
        }
        80%,
        90% {
            stroke: #FF0000;
        }
    }
</style>