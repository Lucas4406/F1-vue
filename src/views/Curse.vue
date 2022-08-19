<template>
    <br>
    <div class="container-curse">
        <div class="scroll-btns" v-show="show">
            <button class="darkmodeBtn" @click="ancursa()">
                <p v-show="textButon">2022</p>
                <p v-show="!textButon">2021</p>
            </button>
        </div>
        <p class="titlu-pagina-curse" ref="sezon-2022" v-show="!an2021">Rezultate curse 2022</p>
        <div class="search-wrapper" v-show="!an2021">
            <input type="text" v-model="search" placeholder="Căutare" class="search-bar"/>
        </div>
        <div class="tabel-container-curse" v-show="!an2021">
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
                                <p class="fastet-lap" :class="{fastestlap: fastest}">{{pilot.FastestLap.timp}} ({{pilot.FastestLap.rank}})</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="spatiu-intre" v-show="showSeparator">-</div>
        <!-- 2021 -->
        <p class="titlu-pagina-curse" ref="sezon-2021" v-show="show && an2021">Rezultate curse 2021</p>
        <div class="search-wrapper" v-show="show && an2021">
            <input type="text" v-model="search2021" placeholder="Căutare" class="search-bar"/>
        </div>
        <div class="tabel-container-curse" v-show="show && an2021">
            <div class="tabel-cursa"  v-for="cursa2021 in filterCurse2021" :key="cursa2021.id">
                <div class="tabel-header">
                    <p class="nume-cursa">{{cursa2021.raceName}}</p>
                    <p class="data-cursa">{{new Date(cursa2021.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p class="loc-cursa">{{cursa2021.Circuit.Location.country}}</p>
                </div>
                <div class="tabel-body-curse">
                    <div class="pilot-container-curse" v-for="pilot2021 in cursa2021.Results" :key="pilot2021.id">
                        <div class="parte-sus-pilot">
                            <div class="pozitie-curse">{{pilot2021.position}}.</div>
                            <div class="numesiechipa">
                                <p class="nume-pilot">{{pilot2021.Driver.givenName}} {{pilot2021.Driver.familyName}}</p>
                                <p class="echipa-pilot">{{pilot2021.Constructor.name}}</p>
                            </div>
                        </div>
                        <div class="parte-jos-pilot">
                            <div class="status">
                                <p class="status-text">Status</p>
                                <p class="status-status">{{pilot2021.status}}</p>
                            </div>
                            <div class="fastest-lap">
                                <p class="fastest-text">Cel mai rapid tur</p>
                                <p class="fastet-lap" :class="{fastestlap: fastest}">{{pilot2021.FastestLap.timp}} ({{pilot2021.FastestLap.rank}})</p>
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
            fastest: false,
            curse2021: [],
            search2021: "",
            show: false,
            an2021: false,
            showSeparator: false,
            textButon: false,
        }
    },
    mounted() {
        document.title = "Rezultate Curse";
        this.getCurse2022()
        this.getCurse2021()
    },
    updated() {
        this.show = true
    },
    methods: {
        async getCurse2022 () {
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
                        this.curse[i].Results[j].rank = resData[i].Results[j].FastestLap.rank
                    }
                    if(this.curse[i].Results[j].FastestLap.rank === "1"){
                        this.fastest = true
                    }
                }
            }
        },

        //2021
        async getCurse2021 () {
            var link2021 = "https://ergast.com/api/f1/2021/results.json?limit=1000"
            const response2021 = await axios.get(link2021)
            const resData2021 = response2021.data.MRData.RaceTable.Races
            this.curse2021 = resData2021
            for(var i = 0; i<resData2021.length;i++){
                for(var j = 0; j<resData2021[i].Results.length;j++){
                    if(resData2021[i].Results[j].FastestLap === undefined){
                        this.curse2021[i].Results[j].FastestLap = "-"
                    }else{
                        this.curse2021[i].Results[j].FastestLap.timp = resData2021[i].Results[j].FastestLap.Time.time
                        this.curse2021[i].Results[j].rank = resData2021[i].Results[j].FastestLap.rank
                    }
                    if(this.curse2021[i].Results[j].FastestLap.rank === "1"){
                        this.fastest = true
                    }
                }
            }
        },
        ancursa () {
            this.an2021 = !this.an2021
            if(this.an2021 === true){
                this.showSeparator = false
                this.textButon= true
            }else{
                this.showSeparator = true
                this.textButon= false
            }
        }
    },
    computed: {
        filterCurse: function () {
            return this.curse.filter((cursa) => {
                return cursa.raceName.toLowerCase().match(this.search.toLowerCase()) || cursa.Circuit.Location.country.toLowerCase().match(this.search.toLowerCase())
            })
        },
        filterCurse2021: function () {
            return this.curse2021.filter((cursa2021) => {
                return cursa2021.raceName.toLowerCase().match(this.search2021.toLowerCase()) || cursa2021.Circuit.Location.country.toLowerCase().match(this.search2021.toLowerCase())
            })
        }
    }
}
</script>

<style>
    @import "../assets/curse.css";
    @import "../assets/searchbar.css";
    @import "../assets/dkmodebtn.css";
</style>