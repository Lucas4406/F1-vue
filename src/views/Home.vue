<template>
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
</template>
<script>
export default {
    name: "Home",
    data () {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            news: [],
            darkMode,
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
        }
    },
}
</script>

<style>
    @import "../assets/home.css";
    @import "../assets/dkmodebtn.css";
</style>