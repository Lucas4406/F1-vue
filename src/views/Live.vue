<template>
  <div class="live-wrapper" :class="{darkmode: darkMode}">
    <p>Livestream</p>
    <br>
    <iframe src="//f1livegp.me/f1/live.php" class="live-frame" name="frame" scrolling="no" frameborder="no" allow="fullscreen" align="center"></iframe>
    <div class="scroll-btns">
        <button class="darkmodeBtn" @click="darkModeToggle()">
            <img src="/night-mode.png" class="poza1" :class="{darkmode: darkMode}">
            <img src="/brightness.png" class="poza2" :class="{darkmode: darkMode}">
        </button>
    </div>
  </div>
</template>

<script>
export default {
    name: "Live",
    data() {
        let darkMode = localStorage.getItem('darkMode') == 'true';
        return {
            darkMode,
        }
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
    },
    mounted() {
        document.title = "Livestream-F1"
        if(this.darkMode){
            document.body.classList.add("darkmode")
        }else{
            document.body.classList.remove("darkmode")
        } 
        this.$emit("live-page")
    },
}
</script>

<style scoped>
    .live-wrapper{
        height: 80vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .live-wrapper.darkmode > p{
        color: white;
    }
    .live-wrapper > p{
        font-size: 3.5rem;
        font-weight: bold;
    }
    .live-frame{
        aspect-ratio: 16/9;
        width: 60%;
    }
    .live-wrapper.darkmode > .live-frame{
        border:2px solid white;
        border-radius: 5px;
    }
    @media(max-width: 1000px){
        .live-wrapper{
            justify-content: flex-start;
        }
        .live-frame{
            aspect-ratio: 16/9;
            width: 90%;
        }
        .live-wrapper > p{
            font-size: 3.5rem;
            font-weight: bold;
            margin-top: 1rem;
        }
    }
</style>