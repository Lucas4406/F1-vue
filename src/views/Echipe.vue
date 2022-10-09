<template>
    <div class="scroll-btns">
        <button class="darkmodeBtn" @click="darkModeToggle()">
            <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
            <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
        </button>
    </div>
    <div class="content-echipe" id="echipeCont">
        <a :href="echipa.link" target="_blank" v-for="(echipa, index) in echipe" :key="index" :class="{echipaFavorita: ok===index}">
            <div class="box" :class="[{darkmode: darkMode}, echipa.echipa.replace(/\s+/g, '')]">
                <div class="linie1">
                    <div class="linie flex flex-row items-center gap-2" id="numar">
                        <div class="">
                            {{echipa.pozitie}}
                        </div>
                        <div class="flex Favcontainer">
                            <img src="Favico.svg" class="w-6 h-6 pozaFav">
                        </div>
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
    import axios from 'axios'
    import {getAuth} from "firebase/auth"
export default {
        name: "Echipe",
        data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        let userID = JSON.parse(localStorage.getItem("currentUser"))
        return {
            echipe: [],
            darkMode,
            userID,
            echipaFav: "",
            ok: "",
        }
    },
    async mounted () {
        document.title = "Echipe"
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        }
        const current = getAuth()
        if(current.currentUser != null){
            await this.getFavTeam()
        }
        fetch("https://f1-site-api.vercel.app/echipe")
        .then(res => res.json())
        .then(data => {
            this.echipe = data
            for(var i = 0 ; i<data.length; i++){
                if(data[i].echipa === this.echipaFav){
                    this.ok = i
                }
            }
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
        async getFavTeam() {
            const resp = await axios(`https://f1-site-api.vercel.app/profile/${this.userID}`)
            if(resp.data[0].favTeam != null){
                const favTeam = resp.data[0].favTeam
                this.echipaFav = favTeam
            }
        }
    },
}
</script>

<style>
    @import "../assets/content-echipe.css";
</style>