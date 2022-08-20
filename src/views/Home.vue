<template>
    <div class="site-wrapper">
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
</template>
<script>
import axios from 'axios'
import herocursa from "../components/herocursa.vue"
export default {
    name: "Home",
    components : {
        herocursa
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
            Hero: false
        }
    },
    mounted () {
        fetch("https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/stiri")
        .then(res => res.json())
        .then(data => {
            this.news = data.Stiri
        })
        .catch(err => console.log(err.message)),
        document.title= "Acasă"
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        }
        this.getCursa() 
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
        async getCursa () {
            var j=15
            var link = "https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/up-next/" + j
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
        }
    },
}
</script>

<style>
    @import "../assets/home.css";
    @import "../assets/dkmodebtn.css";
</style>