<template>
    <div class="content-echipe" id="echipeCont">
            <a :href="echipa.link" target="_blank" v-for="echipa in echipe" :key="echipa.id">
                <div class="box">
                    <div class="linie1">
                        <div class="linie" id="numar">
                            {{echipa.pozitie}}
                        </div>
                        <div class="numee">
                            {{echipa.echipa}}
                        </div>
                        <div class="pozae">
                            <img :src="echipa.logo" class="poza1">
                        </div>
                    </div>
                    <div class="linie2">
                        <div class="nume1">
                            {{echipa.firstName1}}  {{echipa.lastName1}}
                        </div>
                        <div class="nume2">
                            {{echipa.firstName2}}  {{echipa.lastName2}}
                        </div>
                    </div>
                    <div class="linie3">
                        <img :src="echipa.masinaEchipa" class="poza">
                    </div>
                </div>
            </a>
        </div>
</template>
<script>
export default {
    name: "Echipe",
    data() {
        return {
            echipe: []
        }
    },
    mounted () {
        document.title = "Echipe"
        fetch("https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/echipe")
        .then(res => res.json())
        .then(data => {
            this.echipe = data
        })
        .catch(err => console.log(err.message))
    }
}
</script>

<style>
    @import "../assets/content-echipe.css";
</style>