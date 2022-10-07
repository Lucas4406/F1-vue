<template>
    <div class="content-echipe" id="echipeCont">
        <div class="scroll-btns">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
        </div>
        <a :href="echipa.link" target="_blank" v-for="echipa in echipe" :key="echipa.id">
            <div class="box" :class="[{darkmode: darkMode}, echipa.echipa.replace(/\s+/g, '') , {echipaFav: ok}]">
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
    import axios from 'axios'
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
            ok: false
        }
    },
    mounted () {
        document.title = "Echipe"
        fetch("https://f1-site-api.vercel.app/echipe")
        .then(res => res.json())
        .then(data => {
            this.echipe = data
            /* for(var i=0;i<data.length;i++){
                if(data[i].echipa === this.echipaFav){
                    console.log("yeah");
                    this.ok = true
                }
            } */
        })
        .catch(err => console.log(err.message))

        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        }

        this.getFavTeam()
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
            const favTeam = resp.data[0].favTeam
            this.echipaFav = favTeam
        }
    },
}
</script>

<style>
    @import "../assets/content-echipe.css";
</style>