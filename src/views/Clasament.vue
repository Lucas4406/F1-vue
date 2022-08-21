<template>
    <div class="scroll-btns">
        <button class="darkmodeBtn" @click="darkModeToggle()">
            <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
            <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
        </button>
    </div>
    <div class="content-container-echipe">
        <div v-for="team in teams" v-bind:key="team.id" class="constructor-container">
            <div class="card-const" :class="{darkmode: darkMode}">
                <div class="partesus">
                    <p class="pozitie" id="pozitie" :class="{darkmode: darkMode}">{{team.position}}</p>
                    <p class="nume-echipa" id="numeEchipa">{{team.Constructor.name}}</p>
                </div>
                <div class="partejos">
                    <div class="curse-castigate-cont" :class="{darkmode: darkMode}">
                        <p class="text-curse">Curse câștigate</p>
                        <p class="curse-castigate" id="curseCastigate">{{team.wins}}</p>
                    </div>
                    <div class="nrpuncte-cont" :class="{darkmode: darkMode}">
                        <p class="text-puncte"> Număr puncte</p>
                        <p class="nrpuncte" id="nrpuncte">{{team.points}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Clasament",
    data () {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
        teams: [],
        darkMode
        }
    },
    mounted () {
        fetch("https://ergast.com/api/f1/current/constructorStandings.json")
            .then(res => res.json())
            .then(data => {
                this.teams = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
            })
            .catch(err => console.log(err.message)),
        document.title="Clasament echipe"
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

<style>
@import "../assets/clasament.css";
</style>