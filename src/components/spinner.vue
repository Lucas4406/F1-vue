<template>
    <n-spin size="large" :theme-overrides="themeOverrides"/>
</template>

<script>
  import { defineComponent } from 'vue'
  import { NSpin } from 'naive-ui'
  export default defineComponent({
    components: {
      NSpin
    }
  })
  const themeOverrides = {
    Spin: {
        "textColor": "#FF0000FF",
        "color": "#FF0000FF"
    }
  }
</script>
