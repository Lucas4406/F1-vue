<template>
  <span>Your reaction time is:</span>
  <span style="font-weight: bold">{{ score }} ms</span>
  <br />
  <p>{{ rank }}</p>
</template>
<script>
export default {
  props: ["score"],
  data() {
    return {
      rank: null,
    }
  },
  mounted() {
    if (this.score < 100) {
      this.rank = "Why didn't you become a pilot?"
    } else if (this.score > 100 && this.score < 200) {
      this.rank = "You are a driver in Bucharest for sure"
    } else if (this.score > 200 && this.score < 300) {
      this.rank = "You're pretty quick!"
    } else if (this.score > 300 && this.score < 400) {
      this.rank = "Some practice wouldn't hurt..."
    } else {
      this.rank = "Did you fall asleep?"
    }
  },
}
</script>
<style scoped>
span {
  margin: 0;
}
</style>
