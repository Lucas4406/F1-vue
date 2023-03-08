<template>
  <router-link to="/program" class="hero-wrapper">
    <div class="hero-stanga">
      <div class="hero-info">
        <p class="hero-runda">Next - {{ heroData.runda }}</p>
        <div class="steag-locatie">
          <div class="steag-wrapper">
            <img class="hero-steag" :src="heroData.steag" />
          </div>
          <p class="hero-locatie">{{ heroData.tara }}</p>
        </div>
      </div>
      <div class="hero-circuit">
        <img class="circuit-image" :src="heroData.harta" />
      </div>
    </div>
    <div class="hero-dreapta">
      <div class="image-wrapper">
        <img class="hero-image" :src="heroData.imagine" />
      </div>
      <div class="hero-data">
        <p class="data-paragraf">
          {{ heroData.inceput }}-{{ heroData.sfarsit }}
          {{ heroData.lunaCursa }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["heroData"],
}
</script>

<style>
@import "./css/hero-cursa.css";
</style>
