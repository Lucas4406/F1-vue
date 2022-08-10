<template>
        <div class="content-wrapper">
            <br>
            <p class="piloti-text">Clasament piloți 2022</p>
            <br>
            <br>
            <div class="piloti-grid">
                <div class="pilot-container" v-for="pilot in piloti" :key="pilot.id">
                    <div class="pozitiepuncte-pilot">
                        <p class="pozitie-pilot">{{pilot.position}}</p>
                        <div class="nrpuncte-container">
                            <p class="nrpuncte-pilot">{{pilot.points}}</p>
                            <p class="puncte-text-pilot">PCT</p>
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
                    <div class="pozanumar">
                        <img :src="pilot.driverPhoto" class="poza-pilot">
                        <img :src="pilot.driverNumber" class="nr-pilot">
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    name: "CLasamentpiloti",
    data() {
        return {
            piloti: []
        }
    },
    mounted() {
        fetch("https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/clasament-piloti")
        .then(res => res.json())
        .then(data => {
            this.piloti = data
        })
        .catch(err => console.log(err))
        document.title="Clasament piloți"
    },
}
</script>

<style scoped>
@import "../assets/clasamentpiloti.css";
</style>