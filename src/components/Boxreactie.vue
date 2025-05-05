<template>
  <div class="reaction-block" v-if="show" @click="stopTimer">Boom</div>
</template>
<script>
export default {
  props: ["delay"],
  data() {
    return {
      show: false,
      timer: null,
      reactieTimp: 0,
    }
  },
  mounted() {
    setTimeout(() => {
      this.show = true
      this.startTimer()
    }, this.delay)
  },
  updated() {},
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.reactieTimp += 5
      }, 5)
    },
    stopTimer() {
      clearInterval(this.timer)
      this.$emit("sfarsit", this.reactieTimp)
    },
  },
}
</script>
<style scoped>
@import "./css/reactionbox.css";
</style>
