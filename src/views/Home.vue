<template>
<div class="content-container">
    <div v-for="team in teams" v-bind:key="team.id" class="constructor-container">
        <div class="card-const">
            <div class="partesus">
                <p class="pozitie" id="pozitie">{{team.position}}</p>
                <p class="nume-echipa" id="numeEchipa">{{team.Constructor.name}}</p>
            </div>
            <div class="partejos">
                <div class="curse-castigate-cont">
                    <p class="text-curse">Curse câștigate</p>
                    <p class="curse-castigate" id="curseCastigate">{{team.wins}}</p>
                </div>
                <div class="nrpuncte-cont">
                    <p class="text-puncte"> Număr puncte</p>
                    <p class="nrpuncte" id="nrpuncte">{{team.points}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  name: "Home",
  data () {
    return {
      teams: []
    }
  },
  mounted () {
    fetch("https://ergast.com/api/f1/current/constructorStandings.json")
        .then(res => res.json())
        .then(data => {
            this.teams = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        })
        .catch(err => console.log(err.message)),
    document.title="Clasament"
  }
}
</script>

<style>
@import "../assets/clasament.css";
</style>