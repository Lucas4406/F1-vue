<template>
    <div class="content-echipe" id="echipeCont">
        <div class="scroll-btns">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
        </div>
        <a :href="echipa.link" target="_blank" v-for="echipa in echipe" :key="echipa.id">
            <div class="box" :class="[{darkmode: darkMode}, echipa.echipa.replace(/\s+/g, '')]">
                <div class="linie1">
                    <div class="linie" id="numar">
                        {{echipa.pozitie}}
                    </div>
                    <div class="numee">
                        {{echipa.echipa}}
                    </div>
                    <div class="pozae">
                        <img :src="echipa.logo" class="poza1">
                    </div>
                </div>
                <div class="linie2">
                    <div class="nume1">
                        {{echipa.firstName1}}  {{echipa.lastName1}}
                    </div>
                    <div class="nume2">
                        {{echipa.firstName2}}  {{echipa.lastName2}}
                    </div>
                </div>
                <div class="linie3">
                    <img :src="echipa.masinaEchipa" class="poza">
                </div>
            </div>
        </a>
    </div>
</template>
<script>
export default {
    name: "Echipe",
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            echipe: [],
            darkMode,
        }
    },
    mounted () {
        document.title = "Echipe"
        fetch("https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/echipe")
        .then(res => res.json())
        .then(data => {
            this.echipe = data
        })
        .catch(err => console.log(err.message))
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
    },
}
</script>

<style>
    @import "../assets/content-echipe.css";
</style>