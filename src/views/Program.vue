<template>
    <div alt="card-grid" class="grid md:grid-cols-2 p-6 gap-4">
        <div class="bg-red-200 border-black border-2 border-solid max-w-4xl p-4" v-for="cursa in curse" :key="cursa.id">
            <div alt="header" class="flex justify-between text-2xl mb-4 font-bold">
                <p alt="titlu">{{cursa.round}}. {{cursa.raceName}}</p>
                <p alt="circuit">{{cursa.Circuit.circuitId.charAt(0).toUpperCase() + cursa.Circuit.circuitId.slice(1).replace(/_/g, ' ')}}</p>
            </div>
            <div alt="data-wrapper" class="text-xl">
                <div alt="FP1" class="flex justify-between">
                    <p>FP1</p>
                    <p alt="data">{{new Date(cursa.FirstPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{cursa.FirstPractice.time}}</p>
                </div>
                <div alt="FP2" class="flex justify-between">
                    <p>FP2</p>
                    <p alt="data">{{new Date(cursa.SecondPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{cursa.SecondPractice.time}}</p>
                </div>
                <div alt="FP3" v-if="cursa.ThirdPractice" class="flex justify-between">
                    <p>FP3</p>
                    <p alt="data">{{new Date(cursa.ThirdPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{cursa.ThirdPractice.time}}</p>
                </div>
                <div alt="Sprint" v-if="cursa.Sprint" class="flex justify-between">
                    <p>Sprint</p>
                    <p alt="data">{{new Date(cursa.Sprint.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{cursa.Sprint.time}}</p>
                </div>
                <div alt="Quali" class="flex justify-between">
                    <p>Quali</p>
                    <p alt="data">{{new Date(cursa.Qualifying.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{cursa.Qualifying.time}}</p>
                </div>
                <div alt="Cursa" class="flex justify-between">
                    <p>Cursă</p>
                    <p alt="data">{{new Date(cursa.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    <p alt="timp">{{cursa.time}}</p>
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
            show: false,
            curse: []
        }
    },
    mounted() {
        document.title = "Program 2022"
        this.getCurse()
    },
    methods: {
        yeah () {
            this.show = !this.show
        },
        async getCurse () {
            var link = "https://ergast.com/api/f1/2022.json"
            const response = await axios.get(link)
            const resData = response.data.MRData.RaceTable.Races
            console.log(resData);
            this.curse = resData
        }
    },
}
</script>

<style>
    @import "../assets/piloti.css";
</style>