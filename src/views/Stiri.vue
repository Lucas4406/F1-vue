<template>
    <div class="stiri" :class="{darkmode: darkMode}">
        <div class="titlu">
            <div>
                <img src="/checker.webp" class="titlu-poza">
            </div>
            <div class="titlu-text">
                Știri actuale
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
        <a :href="stire.linkuri" class="ltag" v-for="stire in stirif1" :key="stire.id" :class="{darkmode: darkMode}"> 
            <div class="stire">
                <div class="content-row">
                    <div class="content-text" :class="{darkmode: darkMode}">
                        <p class="text" id="stiretext">
                            {{stire.titlu}}
                        </p>
                    </div>
                    <div class="content-photo">
                        <img :src="stire.poza" class="photo" id="stirephoto">
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: "Stiri",
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            stirif1: [],
            darkMode,
        }
    },
    mounted() {
        document.title= "Stiri-F1"
        this.fetchData()
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        } 
    },
    methods: {
        async fetchData () {
            var j=0
            for(j=0;j<22;j++){
                var link = "https://f1-site-api.vercel.app/stiri-translate/" + j
                const response = await axios.get(link)
                const resData = response.data
                this.stirif1[j] = resData
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
        } 
    },
}
</script>
<style>
@import "../assets/home.css";
@import "../assets/dkmodebtn.css";
</style>