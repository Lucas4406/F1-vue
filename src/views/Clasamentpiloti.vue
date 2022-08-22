<template>
        <div class="content-wrapper">
            <div class="scroll-btns">
                <button class="darkmodeBtn" @click="darkModeToggle()">
                    <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                    <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
                </button>
            </div>
            <br>
            <p class="piloti-text" :class="{darkmode: darkMode}">Clasament piloți 2022</p>
            <br>
            <br>
            <div class="piloti-grid">
                <div class="pilot-container" v-for="pilot in piloti" :key="pilot.id" :class="{darkmode: darkMode}">
                    <div class="pozitiepuncte-pilot">
                        <p class="pozitie-pilot">{{pilot.position}}</p>
                        <div class="nrpuncte-container">
                            <p class="nrpuncte-pilot">{{pilot.points}}</p>
                            <p class="puncte-text-pilot" :class="{darkmode: darkMode}">PCT</p>
                        </div>
                    </div>
                    <div class="numesteag">
                        <div class="numesiculoare">
                            <p class="culoare-pilot-pilot" :style="{ color: pilot.driverColor}">|</p>
                            <div class="nume-pilot">
                                <p class="firstname">{{pilot.firstName}}</p>
                                <p class="lastname">{{pilot.lastName}}</p>
                            </div>
                        </div>
                        <img :src="pilot.driverFlag" class="img-steag">
                    </div>
                    <p class="echipa">
                        {{pilot.team}}
                    </p>    
                    <div class="pozanumar" :class="{darkmode: darkMode}">
                        <img :src="pilot.driverPhoto" class="poza-pilot">
                        <img :src="pilot.driverNumber" class="nr-pilot" :class="{darkmode: darkMode}">
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    name: "CLasamentpiloti",
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            piloti: [],
            darkMode
        }
    },
    mounted() {
        fetch("https://f1scraper44.herokuapp.com/clasament-piloti")
        .then(res => res.json())
        .then(data => {
            this.piloti = data
        })
        .catch(err => console.log(err))
        document.title="Clasament piloți"
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

<style scoped>
@import "../assets/clasamentpiloti.css";
</style>