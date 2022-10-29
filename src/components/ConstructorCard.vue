<template>
    <div class="card-const" :class="{darkmode: darkMode}">
        <div class="partesus">
            <p class="pozitie" id="pozitie" :class="{darkmode: darkMode}">{{team.position}}</p>
            <p class="nume-echipa" id="numeEchipa">{{team.Constructor.name}}</p>
        </div>
        <div class="partejos">
            <div class="curse-castigate-cont" :class="{darkmode: darkMode}">
                <p class="text-curse">Curse câștigate</p>
                <p class="curse-castigate" id="curseCastigate">{{team.wins}}</p>
            </div>
            <div class="nrpuncte-cont" :class="{darkmode: darkMode}">
                <p class="text-puncte"> Număr puncte</p>
                <p class="nrpuncte" id="nrpuncte">{{team.points}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["team" , "darkMode"]
    }
</script>