<template>
    <!-- Cursa Urmatoare -->
    <div class="mt-4 justify-center flex items-center gap-6" alt="hero">
        <span class="text-4xl font-bold text-red-600">UP</span>
        <div class="border-red-500 border-2 border-solid sm:max-w-xl sm:w-xl lg:max-w-4xl lg:w-4xl p-4 rounded-md w-[50%]">
            <div alt="header" class="flex justify-between text-2xl mb-4 font-bold">
                <p alt="titlu">{{round}}. {{Name}}</p>
                <p alt="circuit">{{circuitName}}</p>
            </div>
            <div alt="data-wrapper" class="text-xl gap-2 flex flex-col">
                <div alt="FP1" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p class="">FP1</p>
                        <p alt="data" class="">{{FP1.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{FP1.time}}</p>
                </div>
                <div alt="Quali" v-if="Sprint.date" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p class="">Quali</p>
                        <p alt="data" class="">{{Quali.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{Quali.time}}</p>
                </div>
                <div alt="FP2" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>FP2</p>
                        <p alt="data">{{FP2.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{FP2.time}}</p>
                </div>
                <div alt="Sprint" v-if="Sprint.date" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>Sprint</p>
                        <p alt="data">{{Sprint.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{Sprint.time}}</p>
                </div>
                <div alt="FP3" v-if="FP3.date" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>FP3</p>
                        <p alt="data">{{FP3.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{FP3.time}}</p>
                </div>
                <div alt="Quali" v-if="!Sprint.date" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>Quali</p>
                        <p alt="data">{{Quali.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{Quali.time}}</p>
                </div>
                <div alt="Cursa" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>Cursă</p>
                        <p alt="data">{{Race.date}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{Race.time}}</p>
                </div>
            </div>
        </div>
        <span class="text-4xl font-bold text-red-600">NEXT</span>
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
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p class="">FP1</p>
                        <p alt="data" class="">{{new Date(cursa.FirstPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.FirstPractice.date + "T" + cursa.FirstPractice.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Quali" v-if="cursa.Sprint" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p class="">Quali</p>
                        <p alt="data" class="">{{new Date(cursa.Qualifying.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.Qualifying.date + "T" + cursa.Qualifying.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="FP2" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>FP2</p>
                        <p alt="data">{{new Date(cursa.SecondPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.SecondPractice.date + "T" + cursa.SecondPractice.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Sprint" v-if="cursa.Sprint" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>Sprint</p>
                        <p alt="data">{{new Date(cursa.Sprint.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.Sprint.date + "T" + cursa.Sprint.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="FP3" v-if="cursa.ThirdPractice" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>FP3</p>
                        <p alt="data">{{new Date(cursa.ThirdPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.ThirdPractice.date + "T" + cursa.ThirdPractice.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Quali" v-if="!cursa.Sprint" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>Quali</p>
                        <p alt="data">{{new Date(cursa.Qualifying.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.Qualifying.date + "T" + cursa.Qualifying.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
                </div>
                <div alt="Cursa" class="flex justify-between">
                    <div alt="parte-st" class="flex justify-between w-[50%]">
                        <p>Cursă</p>
                        <p alt="data">{{new Date(cursa.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')}}</p>
                    </div>
                    <p alt="timp" class="w-[50%] flex justify-end items-center">{{new Date(cursa.date + "T" + cursa.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')}}</p>
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
            circuitName: "",
            round: "",
            FP1: {
                date: "",
                time:""
            },
            FP2: {
                date: "",
                time:""
            },
            FP3: {
                date: "",
                time:""
            },
            Sprint: {
                date: "",
                time:""
            },
            Quali: {
                date: "",
                time:""
            },
            Race: {
                date: "",
                time:""
            },
            Name: ""
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

            var link = "https://ergast.com/api/f1/2022.json"
            const response = await axios.get(link)
            const resData = response.data.MRData.RaceTable.Races
            this.curse = resData
            this.hero = this.curse[resData1]


            this.circuitName = this.hero.Circuit.circuitId.charAt(0).toUpperCase() + this.hero.Circuit.circuitId.slice(1).replace(/_/g, ' ')
            this.round = this.hero.round
            this.FP1.date = new Date(this.hero.FirstPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')
            this.FP1.time = new Date(this.hero.FirstPractice.date + "T" + this.hero.FirstPractice.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')
            this.FP2.date = new Date(this.hero.SecondPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')
            this.FP2.time = new Date(this.hero.SecondPractice.date + "T" + this.hero.SecondPractice.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')
            if(this.hero.ThirdPractice){
                this.FP3.date = new Date(this.hero.ThirdPractice.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')
                this.FP3.time = new Date(this.hero.ThirdPractice.date + "T" + this.hero.ThirdPractice.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')
            }
            if(this.hero.Sprint){
                this.Sprint.date = new Date(this.hero.Sprint.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')
                this.Sprint.time = new Date(this.hero.Sprint.date + "T" + this.hero.Sprint.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')
            }
            this.Quali.date = new Date(this.hero.Qualifying.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')
            this.Quali.time = new Date(this.hero.Qualifying.date + "T" + this.hero.Qualifying.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')
            this.Race.date = new Date(this.hero.date).toISOString().replace(/T.*/,'').split('-').reverse().join('-')
            this.Race.time = new Date(this.hero.date + "T" + this.hero.time).toLocaleTimeString('en-US',{ hour12: false }).replace(/:[^:]*/,'')
            this.Name = this.hero.raceName
        },
    },
}
</script>

<style>
    
</style>