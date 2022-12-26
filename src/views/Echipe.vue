<template>
    <div class="scroll-btns">
        <button class="darkmodeBtn" @click="darkModeToggle()">
            <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
            <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
        </button>
    </div>
    <div class="content-echipe" id="echipeCont">
        <div class="box" :class="[{darkmode: darkMode}, echipa.name.replace(/\s+/g, ''), {echipaFavorita: ok===index}]" v-for="(echipa, index) in echipe" :key="index">
            <div class="linie1">
                <div class="linie flex flex-row items-center gap-2" id="numar">
                    <div class="">
                        {{echipa.pozitie}}
                    </div>
                    <div class="flex Favcontainer">
                        <img src="/Favico.svg" class="w-6 h-6 pozaFav">
                    </div>
                </div>
                <div class="numee">
                    {{echipa.name}}
                </div>
                <div class="points">
                    <div class="points-number">
                        {{echipa.nrpuncte}}
                    </div>
                    <div class="inverted-pts" v-if="!puncteNull">
                        PTS
                    </div>
                </div>
            </div>
            <div class="linie2">
                <div class="numepilot">
                    {{echipa.drivers[0].driver1.primulNume + " " + echipa.drivers[0].driver1.alDoileaNume}}
                </div>
                <div class="numepilot">
                    {{echipa.drivers[0].driver2.primulNume + " " + echipa.drivers[0].driver2.alDoileaNume}}
                </div>
                <div class="pozae">
                    <img :src="echipa.logo" class="poza1">
                </div>
            </div>
            <div class="linie3">
                <img :src="echipa.masinaPoza"  class="poza">
            </div>
        </div>
    </div>
</template>
<script>
    import { makeRequest } from '../functions/makeRequest'
    export default {
        inject: ["store"],
        name: "Echipe",
        data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            echipe: [],
            darkMode,
            echipaFav: "",
            ok: "",
            puncteNull: false
        }
    },
    mounted () {
        document.title = "Echipe"
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        }
        this.getTeams()
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
        async getTeams () {
            let fav = this.store.state.favTeam
            const data = await makeRequest("https://f1-site-api.vercel.app/mongo/teams/all")
            this.echipe = data
            for(var i = 0 ; i<data.length; i++){
                if(data[i].name === fav){
                    this.ok = i
                }
                if(data[i].nrpuncte === null){
                    this.puncteNull = true
                }
            }
        },
    },
}
</script>

<style>
    @import "../assets/content-echipe.css";
</style>