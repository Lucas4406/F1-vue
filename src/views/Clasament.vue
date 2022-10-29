<template>
    <div class="scroll-btns">
        <button class="darkmodeBtn" @click="darkModeToggle()">
            <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
            <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
        </button>
    </div>
    <div class="content-container-echipe mb-4">
        <div v-for="team in teams" v-bind:key="team.id" class="constructor-container">
            <ConstructorCard :darkMode="darkMode" :team="team" />
        </div>
    </div>
</template>
<script>
import ConstructorCard from '../components/ConstructorCard.vue';

export default {
    name: "Clasament",
    data() {
        let darkMode = localStorage.getItem("darkMode") == "true";
        return {
            teams: [],
            darkMode
        };
    },
    mounted() {
        fetch("https://ergast.com/api/f1/current/constructorStandings.json")
            .then(res => res.json())
            .then(data => {
            this.teams = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        })
            .catch(err => console.log(err.message)),
            document.title = "Clasament echipe";
        console.log("ok");
    },
    methods: {
        darkModeToggle() {
            this.darkMode = !this.darkMode;
            localStorage.setItem("darkMode", this.darkMode);
            if (this.darkMode) {
                document.body.classList.add("darkmode");
            }
            else {
                document.body.classList.remove("darkmode");
            }
        },
    },
    components: { ConstructorCard }
}
</script>

<style>
@import "../assets/clasament.css";
</style>