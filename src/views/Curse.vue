<template>
    <br>
    <div class="container-curse">
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
        <tabelcursa :darkMode="darkMode" :an2021="!an2021" :linkdata="curse2022.linkdata" :titlupagina="curse2022.titlu" v-show="!an2021" />
        <!-- 2021 -->
        <tabelcursa :darkMode="darkMode" :an2021="an2021" :linkdata="curse2021.linkdata" :titlupagina="curse2021.titlu" v-show="show && an2021"/>
    </div>
</template>

<script>
import tabelcursa from "../components/tabelcursa.vue"
export default {
    name: "Curse",
    components: {
        tabelcursa
    },
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            show: false,
            an2021: false,
            showSeparator: false,
            textButon: false,
            darkMode,
            curse2022: {
                linkdata: "https://ergast.com/api/f1/2022/results.json?limit=1000",
                titlu: "Rezultate Curse 2022"

            },
            curse2021: {
                linkdata: "https://ergast.com/api/f1/2021/results.json?limit=1000",
                titlu: "Rezultate Curse 2021"

            },
        }
    },
    mounted() {
        document.title = "Rezultate Curse";
        this.show = true
    },
    updated() {
        this.show = true
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
    computed: {
    }
}
</script>

<style>
    @import "../assets/curse.css";
    @import "../assets/searchbar.css";
    @import "../assets/dkmodebtn.css";
</style>