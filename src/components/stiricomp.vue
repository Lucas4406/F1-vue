<template>
    <div v-if="show">
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
        <Teleport to='.stiri-grid'>
            <div class="scroll-btns">
                <button class="darkmodeBtn" @click="darkModeToggle()">
                    <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                    <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
                </button>
            </div>
        </Teleport>
        <div class="content-grid" :class="{darkmode: darkMode}">
            <a :href="stire.linkuri" v-for="stire in news" v-bind:key="stire.id" class="ltag" :class="{darkmode: darkMode}" target="_blank" v-motion-slide-right>
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
export default {
    name: "Stiri",
    data () {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            news: [],
            show: false,
            darkMode
        }
    },
    mounted () {
        this.fetchData()
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
        },
        async fetchData () {
            var j=0
            for(j=0;j<6;j++){
                var link = "https://f1-site-api.vercel.app/stiri-translate/" + j
                const response = await axios.get(link)
                const resData = response.data
                this.news[j] = resData
                if(this.news[1] !== undefined){
                    this.show=true
                }
            }
        },
    },
}
</script>