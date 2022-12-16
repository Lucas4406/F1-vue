<template>
    <div class="site-wrapper mb-2">
        <br>
        <!-- <herocursa @eroare="handleErr" v-show="Hero" :dataInceput="dataInceput" :dataSfarsit="dataSfarsit" :lunaCursa="lunaCursa" :pozaHarta="pozaHarta" :imagineMare="imagineMare" :runda="runda" :steag="steag" :tara="tara" :key="componentKey"/> -->
        <!-- <p v-show="heroError" class="text-center text-xl mt-4">Please reload the page</p> -->
        <div class="stiri-grid">
            <stiricomp/>
        </div>
    </div>
</template>
<script>
import herocursa from "../components/herocursa.vue"
import stiricomp from "../components/stiricomp.vue"

export default {
    name: "Home",
    components : {
        herocursa,
        stiricomp
    },
    data () {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            darkMode,
            dataInceput: "",
            dataSfarsit: "",
            lunaCursa: "",
            pozaHarta: "",
            imagineMare: "",
            runda: "",
            steag: "",
            tara: "",
            Hero:false,
            heroError: false,
            nrCursa: "",
            componentKey: 0,
        }
    },
    created () {
        document.title= "Acasă"
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        }
        /* this.getCursa() */
    },
    methods: {
        handleErr (val) {
            if(val === true){
                this.componentKey += 1;
                console.log("component reloaded");
            }
        },
        forceRerender () {
            this.componentKey += 1;
        },
        /* async getCursa () {
            try {
                this.nrCursa = await getNext
                var j= this.nrCursa
                var link = "https://f1-site-api.vercel.app/up-next/" + j
                const response = await axios.get(link)
                const resData = response.data
                this.dataInceput = resData.dataCursa1
                this.dataSfarsit = resData.dataCursa2
                this.lunaCursa = resData.lunaCursa
                this.pozaHarta = resData.harta
                this.imagineMare = resData.imagine
                this.runda = resData.runda
                this.steag = resData.steag
                this.tara = resData.tara
                this.Hero = false
            } catch (error) {
                this.heroError = true
                this.forceRerender()
            }
        }, */
    },
}
</script>

<style>
    @import "../assets/home.css";
    @import "../assets/dkmodebtn.css";

    @keyframes p-progress-spinner-color {
        100%,
        0% {
            stroke: #FF0000;
        }
        40% {
            stroke: #FF0000;
        }
        66% {
            stroke: #FF0000;
        }
        80%,
        90% {
            stroke: #FF0000;
        }
    }
</style>