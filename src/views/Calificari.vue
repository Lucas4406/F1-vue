<template>
    <div class="content-container">
        <div class="form-select" :class="{darkmode: darkMode}">
            <label for="ancurse">Alege anul:</label>
            <select id="ancurse" name="ancurse" class="selectie" v-model="ancaliSelect">
                <option value="2022" class="optiune">2022</option>
                <option value="2021" class="optiune">2021</option>
                <option value="2020" class="optiune">2020</option>
                <option value="2019" class="optiune">2019</option>
            </select>
        </div>
        <div class="scroll-btns" v-show="show">
            <button class="darkmodeBtn" @click="darkModeToggle()">
                <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
                <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
            </button>
        </div>
        <!-- 2022 -->
        <tabelcali :linkdata="cali2022.linkdata" :titlupag="cali2022.titlupag" :darkMode="darkMode" v-if="cali2022.an2022"/>
        <!-- 2021 -->
        <tabelcali :linkdata="cali2021.linkdata" :titlupag="cali2021.titlupag" :darkMode="darkMode" v-if="cali2021.an2021"/>
        <!-- 2020 -->
        <tabelcali :linkdata="cali2020.linkdata" :titlupag="cali2020.titlupag" :darkMode="darkMode" v-if="cali2020.an2020"/>
        <!-- 2019 -->
        <tabelcali :linkdata="cali2019.linkdata" :titlupag="cali2019.titlupag" :darkMode="darkMode" v-if="cali2019.an2019"/>
    </div>
</template>

<script>
import tabelcali from "../components/tabelcali.vue"
import router from "../router"
export default {
    name: "Calificari",
    components: {
        tabelcali
    },
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            darkMode,
            ancaliSelect: "2022",
            cali2022: {
                linkdata: "https://ergast.com/api/f1/2022/qualifying.json?limit=1000",
                titlupag: "Rezultate calificări 2022",
                an2022: false
            },
            cali2021: {
                linkdata: "https://ergast.com/api/f1/2021/qualifying.json?limit=1000",
                titlupag: "Rezultate calificări 2021",
                an2021: false
            },
            cali2020: {
                linkdata: "https://ergast.com/api/f1/2020/qualifying.json?limit=1000",
                titlupag: "Rezultate calificări 2020",
                an2020: false
            },
            cali2019: {
                linkdata: "https://ergast.com/api/f1/2019/qualifying.json?limit=1000",
                titlupag: "Rezultate calificări 2019",
                an2019: false
            },
            an2021: false,
            show: false,
            textButon: false
        }
    },
    mounted() {
        document.title = "Rezultate Calificări 2022";
        this.show = true
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        } 
        this.cali2022.an2022 = true
        this.anCaliSelect()
        this.ancaliSelect = this.$route.params.an
    },
    updated() {
        this.show = true
        this.anCaliSelect()
    },
    methods: {
        darkModeToggle() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
            if(this.darkMode){
                document.body.classList.add("darkmode")
            }else{
                document.body.classList.remove("darkmode")
            } 
        },
        anCaliSelect () {
            if(this.ancaliSelect === "2022"){
                this.cali2022.an2022 = true
                this.cali2021.an2021 = false
                this.cali2020.an2020 = false
                this.cali2019.an2019 = false
                document.title = this.cali2022.titlupag
            }
            if(this.ancaliSelect === "2021"){
                this.cali2022.an2022 = false
                this.cali2021.an2021 = true
                this.cali2020.an2020 = false
                this.cali2019.an2019 = false
                document.title = this.cali2021.titlupag
            }
            if(this.ancaliSelect === "2020"){
                this.cali2022.an2022 = false
                this.cali2021.an2021 = false
                this.cali2020.an2020 = true
                this.cali2019.an2019 = false
                document.title = this.cali2020.titlupag
            }
            if(this.ancaliSelect === "2019"){
                this.cali2022.an2022 = false
                this.cali2021.an2021 = false
                this.cali2020.an2020 = false
                this.cali2019.an2019 = true
                document.title = this.cali2019.titlupag
            }

            router.push({
                name: "Calificari",
                params: {an: this.ancaliSelect}
            })
        }
    },
}
</script>

<style>
    @import "../assets/calificari.css";
    @import "../assets/searchbar.css";
</style>