<template>
    <div class="text-wrap" :class="{darkmode: darkMode}">
        <p class="text-titlu" ref="titlul">{{titlupag}}</p>
    </div>
    <div class="search-wrapper">
        <input type="text" v-model="search" placeholder="Căutare" class="search-bar" :class="{darkmode: darkMode}"/>
    </div>
    <div class="tabel-container" v-for="calificare in filterCurse.slice().reverse()" :key="calificare.id" :class="{darkmode: darkMode}">
        <div class="tabel">
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
</template>

<script>
export default {
    props: ["darkMode" , "linkdata" , "titlupag"],
    data() {
        return {
            calificari: [],
            search: "",
            link: this.linkdata,
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData () {
            fetch(this.link)
            .then(response => 
                response.json()
            )
            .then(data => {
                this.calificari = data.MRData.RaceTable.Races
            })
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