<template>
    <br>
    <div class="container-curse">
        <div class="form-select" :class="{darkmode: darkMode}">
            <label for="ancurse">Alege anul:</label>
            <select id="ancurse" name="ancurse" class="selectie" v-model="ancursaSelect">
                <option value="2022" class="optiune">2022</option>
                <option value="2021" class="optiune">2021</option>
                <option value="2020" class="optiune">2020</option>
                <option value="2019" class="optiune">2019</option>
            </select>
            <!-- <br>
            <br>
            <button @click="ordonareasc()">Asc</button>
            <button @click="ordonaredesc()">Desc</button> -->
        </div>
        <div class="scroll-btns" v-show="show">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
        </div>
        <!-- 2022 -->
        <tabelcursa :darkMode="darkMode" :linkdata="curse2022.linkdata" :titlupagina="curse2022.titlu" :asc="asc" v-if="curse2022.an2022" />
        <!-- 2021 -->
        <tabelcursa :darkMode="darkMode"  :linkdata="curse2021.linkdata" :titlupagina="curse2021.titlu" :asc="asc" v-if="curse2021.an2021"/>
        <!-- 2020 -->
        <tabelcursa :darkMode="darkMode" :linkdata="curse2020.linkdata" :titlupagina="curse2020.titlu" :asc="asc" v-if="curse2020.an2020"/>
        <!-- 2019 -->
        <tabelcursa :darkMode="darkMode"  :linkdata="curse2019.linkdata" :titlupagina="curse2019.titlu" :asc="asc" v-if="curse2019.an2019"/>
    </div>
</template>

<script>
import tabelcursa from "../components/tabelcursa.vue"
export default {
    name: "Curse",
    components: {
        tabelcursa
    },
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            showSeparator: false,
            textButon: false,
            darkMode,
            show: false,
            ancursaSelect: "2022",
            asc: false,
            curse2022: {
                linkdata: "https://ergast.com/api/f1/2022/results.json?limit=1000",
                titlu: "Rezultate Curse 2022",
                an2022: false
            },
            curse2021: {
                linkdata: "https://ergast.com/api/f1/2021/results.json?limit=1000",
                titlu: "Rezultate Curse 2021",
                an2021: false
            },
            curse2020: {
                linkdata: "https://ergast.com/api/f1/2020/results.json?limit=1000",
                titlu: "Rezultate Curse 2020",
                an2020: false
            },
            curse2019: {
                linkdata: "https://ergast.com/api/f1/2019/results.json?limit=1000",
                titlu: "Rezultate Curse 2019",
                an2019: false
            },
        }
    },
    mounted() {
        document.title = "Rezultate Curse 2022";
        this.show = true
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        } 
        this.curse2022.an2022 = true
        this.anCursaSelect()
    },
    updated() {
        this.show = true
        this.anCursaSelect()
    },
    methods: {
        ancursa () {
            this.an2021 = !this.an2021
            if(this.an2021 === true){
                this.showSeparator = false
                this.textButon= true
            }else{
                this.showSeparator = true
                this.textButon= false
            }
        },
        darkModeToggle() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
            if(this.darkMode){
                document.body.classList.add("darkmode")
            }else{
                document.body.classList.remove("darkmode")
            } 
        },
        anCursaSelect () {
            if(this.ancursaSelect === "2022"){
                this.curse2022.an2022 = true
                this.curse2021.an2021 = false
                this.curse2020.an2020 = false
                this.curse2019.an2019 = false
                document.title = this.curse2022.titlu
            }
            if(this.ancursaSelect === "2021"){
                this.curse2022.an2022 = false
                this.curse2021.an2021 = true
                this.curse2020.an2020 = false
                this.curse2019.an2019 = false
                document.title = this.curse2021.titlu
            }
            if(this.ancursaSelect === "2020"){
                this.curse2022.an2022 = false
                this.curse2021.an2021 = false
                this.curse2020.an2020 = true
                this.curse2019.an2019 = false
                document.title = this.curse2020.titlu
            }
            if(this.ancursaSelect === "2019"){
                this.curse2022.an2022 = false
                this.curse2021.an2021 = false
                this.curse2020.an2020 = false
                this.curse2019.an2019 = true
                document.title = this.curse2019.titlu
            }
        },
        ordonareasc () {
            this.asc = true
            console.log(this.asc);
        },
        ordonaredesc () {
            this.asc = false
            console.log(this.asc);
        }
    },
    computed: {
    }
}
</script>

<style>
    @import "../assets/curse.css";
    @import "../assets/searchbar.css";
    @import "../assets/dkmodebtn.css";
    @import "../assets/formSelect-curse.css";
.fade-v-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>