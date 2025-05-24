<template>
  <router-link to="/program" class="hero-wrapper">
    <div class="hero-stanga">
      <div class="hero-info">
        <p class="hero-runda">{{ heroData.meetingContext.status }}</p>
        <div class="steag-locatie">
<!--          <div class="steag-wrapper">-->
<!--            <img class="hero-steag" :src="heroData.pozaSteag" />-->
<!--          </div>-->
          <p class="hero-locatie">{{ heroData.race.meetingCountryName }}</p>
        </div>
      </div>
      <div class="hero-circuit">
        <img class="circuit-image" :src="heroData.circuitSmallImage.url" :alt="`Poza circuit ${heroData.race.meetingLocation}`" />
      </div>
    </div>
    <div class="hero-dreapta">
      <div class="image-wrapper">
        <img class="hero-image" :src="heroData.seasonYearImage" :alt="`Poza sezon ${heroData.seasonContext.seasonYear}`"/>
      </div>
      <div class="hero-data">
        <p class="data-paragraf">
          {{ heroData.inceput }}-{{ heroData.sfarsit }}
          {{ heroData.lunaCursaText }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["heroData", "smallText"],
}
</script>

<style>
@import "./css/hero-cursa.css";
</style>
