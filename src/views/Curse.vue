<template>
    <br>
    <div class="container-curse">
        <p class="titlu-pagina-curse">Rezultate curse 2022</p>
        <div class="search-wrapper">
            <input type="text" v-model="search" placeholder="Căutare" class="search-bar"/>
        </div>
        <div class="tabel-container-curse">
            <div class="tabel-cursa"  v-for="cursa in filterCurse.slice().reverse()" :key="cursa.id">
                <div class="tabel-header">
                    <p class="nume-cursa">{{cursa.raceName}}</p>
                    <p class="data-cursa">{{new Date(cursa.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p class="loc-cursa">{{cursa.Circuit.Location.country}}</p>
                </div>
                <div class="tabel-body-curse">
                    <div class="pilot-container-curse" v-for="pilot in cursa.Results" :key="pilot.id">
                        <div class="parte-sus-pilot">
                            <div class="pozitie-curse">{{pilot.position}}.</div>
                            <div class="numesiechipa">
                                <p class="nume-pilot">{{pilot.Driver.givenName}} {{pilot.Driver.familyName}}</p>
                                <p class="echipa-pilot">{{pilot.Constructor.name}}</p>
                            </div>
                        </div>
                        <div class="parte-jos-pilot">
                            <div class="status">
                                <p class="status-text">Status</p>
                                <p class="status-status">{{pilot.status}}</p>
                            </div>
                            <div class="fastest-lap">
                                <p class="fastest-text">Cel mai rapid tur</p>
                                <p class="fastet-lap" :class="fastest">{{pilot.FastestLap.timp}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "Curse",
    data() {
        return {
            curse: [],
            search: "",
            fastest: "",
            rankFastest: [],
        }
    },
    mounted() {
        document.title = "Rezultate Curse";
        this.getCurse()
    },
    methods: {
        async getCurse () {
            var link = "https://ergast.com/api/f1/2022/results.json?limit=1000"
            const response = await axios.get(link)
            const resData = response.data.MRData.RaceTable.Races
            this.curse = resData
            for(var i = 0; i<resData.length;i++){
                for(var j = 0; j<resData[i].Results.length;j++){
                    if(resData[i].Results[j].FastestLap === undefined){
                        this.curse[i].Results[j].FastestLap = "-"
                    }else{
                        this.curse[i].Results[j].FastestLap.timp = resData[i].Results[j].FastestLap.Time.time
                        if(resData[i].Results[j].FastestLap.rank === 1){
                            this.fastest = "fastestlap"
                        }
                    }
                }
            }
            /* console.log(resData[0].Results[0].FastestLap);
            for(var i = 0; i<resData.length;i++){
                for(var j = 0; j<resData[i].Results.length;j++){
                    if(resData[i].Results[j].FastestLap !== undefined){
                        this.rankFastest[i].Results[j].rank = resData[i].Results[j].FastestLap.rank
                    }
                }
            }
            console.log(this.rankFastest); */
        }
    },
    computed: {
        filterCurse: function () {
            return this.curse.filter((cursa) => {
                return cursa.raceName.toLowerCase().match(this.search.toLowerCase()) || cursa.Circuit.Location.country.toLowerCase().match(this.search.toLowerCase())
            })
        }
    }
}
</script>

<style>
    @import "../assets/curse.css";
    @import "../assets/searchbar.css";
</style>