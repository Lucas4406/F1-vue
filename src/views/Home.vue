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
    <div class="content-grid">
        <a :href="stire.link" v-for="stire in news" v-bind:key="stire.id" class="ltag">
            <div class="stire">
                <div class="content-row">
                    <div class="content-text">
                        <p class="text" id="stiretext">{{stire.titlu}}</p>
                    </div>
                    <div class="content-photo">
                        <img :src="stire.poza" class="photo" id="stirephoto">
                    </div>
                </div>
            </div>
        </a>
        <!-- <router-link :to="stire.link" v-for="stire in news" v-bind:key="stire.id" class="ltag">
        </router-link> -->
    </div>
</template>
<script>
export default {
    name: "Home",
    data () {
        return {
            news: []
        }
    },
    mounted () {
        fetch("https://aqueous-escarpment-24578.herokuapp.com/https://f1scraper44.herokuapp.com/stiri")
        .then(res => res.json())
        .then(data => {
            this.news = data.Stiri
        })
        .catch(err => console.log(err.message)),
        document.title= "Acasă"
    }
}
</script>

<style>
    @import "../assets/home.css";
</style>