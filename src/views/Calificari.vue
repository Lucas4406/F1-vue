<template>
    <div class="content-container">
        <div class="scroll-btns" v-show="show">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
            <br>
            <button class="btn2021" @click="ancursa()">
                <p v-show="textButon">2022</p>
                <p v-show="!textButon">2021</p>
            </button>
        </div>
        <!-- 2022 -->
        <tabelcali :linkdata="cali2022.linkdata" :titlupag="cali2022.titlupag" :darkMode="darkMode" :an2021="!an2021" v-show="!an2021"/>
        <!-- 2021 -->
        <tabelcali :linkdata="cali2021.linkdata" :titlupag="cali2021.titlupag" :darkMode="darkMode" :an2021="an2021" v-show="an2021"/>
    </div>
</template>

<script>
import tabelcali from "../components/tabelcali.vue"
export default {
    name: "Calificari",
    components: {
        tabelcali
    },
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            darkMode,
            cali2022: {
                linkdata: "https://ergast.com/api/f1/2022/qualifying.json?limit=1000",
                titlupag: "Rezultate calificări 2022"
            },
            cali2021: {
                linkdata: "https://ergast.com/api/f1/2021/qualifying.json?limit=1000",
                titlupag: "Rezultate calificări 2021"
            },
            an2021: false,
            show: false,
            textButon: false
        }
    },
    mounted() {
        if(this.an2021 === false){
            document.title = "Rezultate Calificări 2022";
        }else{
            document.title = "Rezultate Calificări 2021"
        }
        this.show = true
    },
    updated() {
        this.show = true
        if(this.an2021 === false){
            document.title = "Rezultate Calificări 2022";
        }else{
            document.title = "Rezultate Calificări 2021"
        }
    },
    methods: {
        ancursa () {
            this.an2021 = !this.an2021
            if(this.an2021 === true){
                this.showSeparator = false
                this.textButon= true
            }else{
                this.showSeparator = true
                this.textButon= false
            }
        },
        darkModeToggle() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
            if(this.darkMode){
                document.body.classList.add("darkmode")
            }else{
                document.body.classList.remove("darkmode")
            } 
        },
    },
}
</script>

<style>
    @import "../assets/calificari.css";
    @import "../assets/searchbar.css";
</style>