<template>
    <div class="content-container">
        <div class="text-wrap">
            <p class="text-titlu" ref="titlul">Rezultate calificări 2022</p>
        </div>
        <div class="search-wrapper">
            <input type="text" v-model="search" placeholder="Căutare" class="search-bar"/>
        </div>
        <div class="tabel-container" v-for="calificare in filterCurse.slice().reverse()" :key="calificare.id">
            <div>
                <div class="nume-cursa">{{calificare.raceName}}</div>
                <div class="data-cursa">{{new Date(calificare.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</div>
                <div class="loc-cursa">{{calificare.Circuit.Location.country}}</div>
                <div class="laptime">
                    <div class="gol"></div>
                    <div class="q-container">
                        <p class="quri" id="q1">Q1</p>
                        <p class="quri" id="q2">Q2</p>
                        <p class="quri" id="q3">Q3</p>
                    </div>
                </div>
                <div class="piloti-container" v-for="pilot in calificare.QualifyingResults" :key="pilot.id" ref="pilot">
                    <div class="pilot">
                        <div class="parte-stanga">{{pilot.position}}. {{pilot.Driver.givenName}} {{pilot.Driver.familyName}}</div>
                        <div class="parte-dreapta">
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
import axios from 'axios';
export default {
    name: "Calificari",
    data() {
        return {
            calificari: [],
            search: "",
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
        }
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