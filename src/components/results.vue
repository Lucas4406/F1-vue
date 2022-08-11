<template>
    <span>Timpul tău de reacție este de:</span>
    <span style="font-weight: bold">{{score}} ms</span>
    <br>
    <p>{{rank}}</p>
</template>
<script>
export default {
    props: ["score"],
    data() {
        return {
            rank: null
        }
    },
    mounted() {
        if(this.score < 100){
            this.rank = "De ce nu te-ai făcut pilot?"
        }else if(this.score > 100 && this.score < 200){
            this.rank = "Ești șofer în București"
        }else if(this.score > 200 && this.score < 300){
            this.rank = "Ești destul de rapid!"
        }else if(this.score > 300 && this.score < 400){
            this.rank = "Nu ar strica puțin antrenament"
        }
        else{
            this.rank = "Ai adormit?"
        }
    }
}
</script>
<style>
@import "./css/result.css";
</style>