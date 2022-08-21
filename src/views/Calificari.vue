<template>
    <div class="content-container">
        <div class="scroll-btns">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
        </div>
        <div class="text-wrap">
            <p class="text-titlu" ref="titlul" :class="{darkmode: darkMode}">Rezultate calificări 2022</p>
        </div>
        <div class="search-wrapper">
            <input type="text" v-model="search" placeholder="Căutare" class="search-bar" :class="{darkmode: darkMode}"/>
        </div>
        <div class="tabel-container" v-for="calificare in filterCurse.slice().reverse()" :key="calificare.id" :class="{darkmode: darkMode}">
            <div>
                <div class="nume-cursa">{{calificare.raceName}}</div>
                <div class="data-cursa">{{new Date(calificare.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</div>
                <div class="loc-cursa">{{calificare.Circuit.Location.country}}</div>
                <div class="laptime">
                    <div class="gol"></div>
                    <div class="q-container">
                        <p class="quri q1" id="q1" :class="{darkmode: darkMode}">Q1</p>
                        <p class="quri" id="q2">Q2</p>
                        <p class="quri" id="q3">Q3</p>
                    </div>
                </div>
                <div class="piloti-container" v-for="pilot in calificare.QualifyingResults" :key="pilot.id" ref="pilot">
                    <div class="pilot">
                        <div class="parte-stanga" :class="{darkmode: darkMode}">{{pilot.position}}. {{pilot.Driver.givenName}} {{pilot.Driver.familyName}}</div>
                        <div class="parte-dreapta" :class="{darkmode: darkMode}">
                            <div class="timp-container" id="q1">{{pilot.Q1}}</div>
                            <div class="timp-container" id="q2">{{pilot.Q2}}</div>
                            <div class="timp-container" id="q3">{{pilot.Q3}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Calificari",
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            calificari: [],
            search: "",
            darkMode
        }
    },
    methods: {

    },
    mounted() {
        document.title = "Rezultate Calificări";
        this.getData()
    },
    methods: {
        async getData () {
            var j
            for(j=2022;j>2021;j--){
                fetch(`https://ergast.com/api/f1/${j}/qualifying.json?limit=1000`)
                .then(response => 
                    response.json()
                )
                .then(data => {
                    this.calificari = data.MRData.RaceTable.Races
                })
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
        },
    },
    computed: {
        filterCurse: function () {
            return this.calificari.filter((calificare) => {
                return calificare.raceName.toLowerCase().match(this.search.toLowerCase()) || calificare.Circuit.Location.country.toLowerCase().match(this.search.toLowerCase())
            })
        }
    }
}
</script>

<style>
    @import "../assets/calificari.css";
    @import "../assets/searchbar.css";
</style>