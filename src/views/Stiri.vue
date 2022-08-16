<template>
    <div class="stiri">
        <div class="titlu">
            <div>
                <img src="/checker.webp" class="titlu-poza">
            </div>
            <div class="titlu-text">
                Știri de ultimă oră
            </div>
            <div>
                <img src="/checker.webp" class="titlu-poza">
            </div>
        </div>
    </div>
    <div class="content-grid" >
        <a :href="stire.linkuri" class="ltag" v-for="stire in stirif1" :key="stire.id">
            <div class="stire">
                <div class="content-row">
                    <div class="content-text">
                        <p class="text" id="stiretext">
                            {{stire.titlu}}
                        </p>
                    </div>
                    <div class="content-photo">
                        <img :src="stire.poza" class="photo" id="stirephoto">
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: "Stiri",
    data() {
        return {
            stirif1: []
        }
    },
    mounted () {
        document.title= "Stiri-F1"
        this.fetchData()
    },
    methods: {
        async fetchData () {
            var j=0
            for(j=0;j<22;j++){
                var link = "https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/stiri-translate/" + j
                const response = await axios.get(link)
                const resData = response.data
                this.stirif1[j] = resData
            }
            console.log(this.stirif1);
        }  
    },
}
</script>
<style>
@import "../assets/home.css";
</style>