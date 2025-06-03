<!-- components/Podium.vue -->
<template>
    <router-link :to="top3.linkCursaVeche" class="flex flex-col md:flex-row justify-center items-center md:items-end gap-8 md:h-[24rem] text-inherit no-underline hover:no-underline">
      <PodiumCard
          v-if="top3[1]"
          :position="2"
          :driver="top3[1]"
          bgColor="bg-gray-500"
          cardColor="bg-gray-100"
          borderColor="border-black"
          :width="'w-72 md:w-56'"
          :height="'h-56 md:h-72'"
      />
      <PodiumCard
          v-if="top3[0]"
          :position="1"
          :driver="top3[0]"
          bgColor="bg-yellow-400"
          cardColor="bg-yellow-100"
          borderColor="border-yellow-400"
          :width="'w-72 md:w-60'"
          :height="'h-64 md:h-80'"
      />
      <PodiumCard
          v-if="top3[2]"
          :position="3"
          :driver="top3[2]"
          bgColor="bg-orange-500"
          cardColor="bg-orange-100"
          borderColor="border-black"
          :width="'w-72 md:w-52'"
          :height="'h-52 md:h-64'"
      />
    </router-link>
</template>

<script setup>
import PodiumCard from './PodiumCard.vue'

defineProps({
  top3: {
    type: Array,
    required: true
  }
})
</script>
