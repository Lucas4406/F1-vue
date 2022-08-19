<template>
  <div class="hero-wrapper">
        <div class="hero-stanga">
            <div class="hero-info">
                <p class="hero-runda">{{runda}}</p>
                <div class="steag-locatie">
                    <div class="steag-wrapper">
                        <img class="hero-steag" :src="steag">
                    </div>
                    <p class="hero-locatie">{{tara}}</p>
                </div>
            </div>
            <div class="hero-circuit">
                <img class="circuit-image" :src="pozaHarta">
            </div>
        </div>
        <div class="hero-dreapta">
            <div class="image-wrapper">
                <img class="hero-image" :src="imagineMare">
            </div>
            <div class="hero-data">
                <p class="data-paragraf">{{dataInceput}}-{{dataSfarsit}} {{lunaCursa}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["dataInceput", "dataSfarsit", "lunaCursa", "pozaHarta", "imagineMare", "runda", "steag", "tara"],
}
</script>

<style>
    @import "./css/hero-cursa.css";
</style>