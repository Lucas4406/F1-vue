<template>
    <!-- Cursa Urmatoare -->
    <div class="w-screen flex justify-center items-center">
        <button class="" href="">Cursa Urmatoare</button>
    </div>
    <!-- Card Grid -->
    <div alt="card-grid" class="grid lg:grid-cols-2 md:grid-cols-1 lg:px-14 sm:p-6 gap-6 sm:justify-center">
        <div class="border-black border-2 border-solid sm:max-w-xl lg:max-w-4xl p-4 sm:ml-20 md:ml-20 lg:ml-0 rounded-md" v-for="cursa in curse" :key="cursa.id" :id="cursa.Circuit.circuitId">
            <div alt="header" class="flex justify-between text-2xl mb-4 font-bold">
                <p alt="titlu">{{cursa.round}}. {{cursa.raceName}}</p>
                <p alt="circuit">{{cursa.Circuit.circuitId.charAt(0).toUpperCase() + cursa.Circuit.circuitId.slice(1).replace(/_/g, ' ')}}</p>
            </div>
            <div alt="data-wrapper" class="text-xl gap-2 flex flex-col">
                <div alt="FP1" class="flex justify-between">
                    <p class="grow">FP1</p>
                    <p alt="data" class="grow flex justify-center items-center">{{new Date(cursa.FirstPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp" class="grow flex justify-end items-center">{{new Date(cursa.FirstPractice.date + "T" + cursa.FirstPractice.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Quali" v-if="cursa.Sprint" class="flex justify-between">
                    <p class="grow">Quali</p>
                    <p alt="data" class="grow flex justify-center items-center">{{new Date(cursa.Qualifying.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp" class="grow flex justify-end items-center">{{new Date(cursa.Qualifying.date + "T" + cursa.Qualifying.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="FP2" class="flex justify-between">
                    <p>FP2</p>
                    <p alt="data">{{new Date(cursa.SecondPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{new Date(cursa.SecondPractice.date + "T" + cursa.SecondPractice.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Sprint" v-if="cursa.Sprint" class="flex justify-between">
                    <p>Sprint</p>
                    <p alt="data">{{new Date(cursa.Sprint.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{new Date(cursa.Sprint.date + "T" + cursa.Sprint.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="FP3" v-if="cursa.ThirdPractice" class="flex justify-between">
                    <p>FP3</p>
                    <p alt="data">{{new Date(cursa.ThirdPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{new Date(cursa.ThirdPractice.date + "T" + cursa.ThirdPractice.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Quali" v-if="!cursa.Sprint" class="flex justify-between">
                    <p>Quali</p>
                    <p alt="data">{{new Date(cursa.Qualifying.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{new Date(cursa.Qualifying.date + "T" + cursa.Qualifying.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Cursa" class="flex justify-between">
                    <p>Cursă</p>
                    <p alt="data">{{new Date(cursa.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{new Date(cursa.date + "T" + cursa.time).toLocaleTimeString().replace(/:[^:]*/,'')}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "Program",
    data() {
        return {
            curse: [],
            hero: [],
            nr: "",
            actualId: ""
        }
    },
    mounted() {
        document.title = "Program 2022"
        this.getCurse()
    },
    methods: {
        async getCurse () {
            var link1 = "https://ergast.com/api/f1/2022/results.json?limit=1000"
            const res = await axios.get(link1)
            const resData1 = res.data.MRData.RaceTable.Races.length
            this.nr = resData1

            var link = "https://ergast.com/api/f1/2022.json"
            const response = await axios.get(link)
            const resData = response.data.MRData.RaceTable.Races
            this.curse = resData
            this.hero = this.curse[resData1]
            this.actualId = this.curse[resData1].Circuit.circuitId
        },
    },
}
</script>

<style>
    
</style>