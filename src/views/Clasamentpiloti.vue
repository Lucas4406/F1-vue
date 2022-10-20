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
                <div class="pilot-container" v-for="(pilot , index) in piloti" :key="index" :class="{darkmode: darkMode}">
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
                    <div class="flex flex-row justify-between items-center">
                        <p class="echipa">
                            {{pilot.team}}
                        </p>    
                        <p class="echipa">{{pilot.gapDelta}}</p>
                    </div>
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
    inject: ["store"],
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            piloti: [],
            darkMode
        }
    },
    mounted() {
        console.log(this.store.state.favDriver)
        fetch("https://f1-site-api.vercel.app/clasament-piloti")
        .then(res => res.json())
        .then(data => {
            var first = data[0].points
            var firstThree = data[0].lastName.substring(0, 3).toUpperCase()
            data[0].gapDelta = ""
            for(var i=1;i<data.length;i++){
                var delta = first - data[i].points
                if(delta < 200){
                    data[i].gapDelta = `Gap to ${firstThree} ` + JSON.stringify(-delta)
                }else{
                    data[i].gapDelta = ""
                }
            }
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