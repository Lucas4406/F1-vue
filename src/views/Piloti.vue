<template>
    <div class="content" id="pilotiCont">
            <div class="box-echipa" id="ferrari" v-for="echipa in Ferrari" :key="echipa.id">
                <span class="nume-echipa">
                    Ferrari
                </span>
                <div class="piloti">
                    <div class="pilot1">
                        <div class="pozapilot">
                            <img src="" class="poza-echipa">
                            <img src="" class="numar">
                        </div>
                        <div class="info" id="charles">
                            <p class="numepilot">Charles Leclerc</p>
                            <p><strong>Echipă:</strong><span class="text-echipa"> </span></p>
                            <p><strong>Țară:</strong><span class="text-tara"> </span></p>
                            <p><strong>Podiumuri:</strong><span class="text-podium"> </span></p>
                            <p><strong>Puncte:</strong><span class="text-puncte"> </span></p>
                            <p><strong>Grands Prix-uri începute:</strong><span class="text-gp"> </span></p>
                            <p><strong>Campionate câștigate:</strong><span class="text-campionate"> </span></p>
                            <p><strong>Cea mai bună clasare în cursă:</strong><span class="text-cl-cursa"> </span></p>
                            <p><strong>Cea mai bună clasare în calificări:</strong><span class="text-cl-quali"> </span></p>
                            <p><strong>Data nașterii:</strong><span class="text-data"> </span></p>
                            <p><strong>Locul nașterii:</strong><span class="text-loc"> </span></p>
                        </div>
                    </div>
                    <div class="pilot2">
                        <div class="pozapilot">
                            <img src="" class="poza">
                            <img src="" class="numar">
                        </div>
                        <div class="info" id="carlos">
                            <p class="numepilot">Carlos Sainz</p>
                            <p><strong>Echipă:</strong><span class="text-echipa"> </span></p>
                            <p><strong>Țară:</strong><span class="text-tara"> </span></p>
                            <p><strong>Podiumuri:</strong><span class="text-podium"> </span></p>
                            <p><strong>Puncte:</strong><span class="text-puncte"> </span></p>
                            <p><strong>Grands Prix-uri începute:</strong><span class="text-gp"> </span></p>
                            <p><strong>Campionate câștigate:</strong><span class="text-campionate"> </span></p>
                            <p><strong>Cea mai bună clasare în cursă:</strong><span class="text-cl-cursa"> </span></p>
                            <p><strong>Cea mai bună clasare în calificări:</strong><span class="text-cl-quali"> </span></p>
                            <p><strong>Data nașterii:</strong><span class="text-data"> </span></p>
                            <p><strong>Locul nașterii:</strong><span class="text-loc"> </span></p>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "Piloti",
    data() {
        return {
            Ferrari: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData () {
            const link = "https://f1-site-api.vercel.app/piloti"
            const response = await axios.get(link)
            const resData = response.data
            this.Ferrari = resData[1]
            console.log(this.Ferrari);
        }
    },
}
</script>

<style>
    @import "../assets/piloti.css";
</style>