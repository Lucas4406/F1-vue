<!-- components/PodiumCard.vue -->
<template>
  <div :class="`flex flex-col items-center ${width} transition-transform duration-200 hover:scale-105`">
    <div :class="`${bgColor} text-white text-lg md:text-xl px-5 py-2 rounded-t-xl shadow font-bold`">
      {{ position }}
    </div>
    <div :class="`${cardColor} w-full ${height} rounded-b-xl flex flex-col justify-center items-center shadow-md border-[6px] ${borderColor} border-t-0 px-4`">
      <p class="font-semibold text-center text-base md:text-lg">{{ driver.driverName }}</p>
      <p class="text-base text-gray-800">{{ driver.points }} pts</p>
      <p class="text-sm text-gray-600">{{ driver.time }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  position: Number,
  driver: Object,
  bgColor: String,
  cardColor: String,
  borderColor: String,
  width: String,
  height: String
})
</script>
