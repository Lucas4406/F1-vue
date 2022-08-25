<template>
    <p class="titlu-pagina-curse" ref="sezon-2022" :class="{darkmode: darkMode}">{{titlupagina}}</p>
    <div class="search-wrapper">
        <input type="text" v-model="search" placeholder="Căutare" class="search-bar" :class="{darkmode: darkMode}"/>
    </div>
    <div class="tabel-container-curse">
        <div class="tabel-cursa"  v-for="cursa in filterCurse.slice().reverse()" :key="cursa.id" :class="{darkmode: darkMode}">
            <div class="tabel-header">
                <p class="nume-cursa">{{cursa.raceName}}</p>
                <p class="loc-cursa">{{cursa.Circuit.circuitName.toUpperCase()}}</p>
                <p class="data-cursa">{{new Date(cursa.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
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
                    <div class="parte-jos-pilot" :class="{darkmode: darkMode}">
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
</template>

<script>
import axios from 'axios'
export default {
    props: ["darkMode" , "linkdata" , "titlupagina" , "asc"],
    data() {
        return {
            curse: [],
            search: "",
            fastest: false,
            link: this.linkdata,
            ordonare: this.asc,
            /* curseOrd: [] */
        }
    },
    methods: {
        async getCurse () {
            const response = await axios.get(this.link)
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
        /* ascDesc () {
            if(this.ordonare === true){
                this.curseOrd = this.filterCurse
            }else{
                this.curseOrd = this.filterCurse.slice().reverse()
            }
        } */
    },
    mounted() {
        this.getCurse()
        /* this.ascDesc() */
    },
    updated() {
        /* this.ascDesc() */
    },
    computed: {
        filterCurse: function () {
            return this.curse.filter((cursa) => {
                return cursa.raceName.toLowerCase().match(this.search.toLowerCase()) || cursa.Circuit.circuitName.toLowerCase().match(this.search.toLowerCase())
            })
        },
    }

}
</script>
