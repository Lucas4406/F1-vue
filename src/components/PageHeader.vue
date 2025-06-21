<template>
  <header class="text-center mb-12 antialiased">
    <h1 class="sm:text-4xl md:text-5xl font-extrabold tracking-tight source text-black">
      {{title}}
    </h1>
    <p class="mt-2 text-lg text-gray-500 ">{{subtitle}}</p>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: '2025 Season'
  }
});
</script>
