<script setup>
defineProps({
  top3: {
    type: Array,
    required: true
  },
  title: String
})
</script>

<template>
  <div class="text-center mb-10" v-if="title">
    <h2 class="text-3xl md:text-4xl font-semibold source">
      {{title}}
    </h2>
  </div>
  <div class="flex flex-row justify-center items-end gap-10 lg:h-[24rem]">
    <!-- Locul 2 -->
    <div v-if="top3[1]" class="flex flex-col items-center w-72 md:w-56 transition-transform duration-200 hover:scale-105">
      <div class="bg-gray-500 text-white text-3xl lg:text-2xl px-5 py-2 rounded-t-xl shadow font-bold">2</div>
      <div class="bg-gray-100 w-full h-56 md:h-72 rounded-b-xl flex flex-col justify-center items-center shadow-md border-[6px] border-black border-t-0 px-4">
        <slot name="secondPodiumSlot" />
      </div>
    </div>

    <!-- Locul 1 -->
    <div v-if="top3[0]" class="flex flex-col items-center w-72 md:w-60 transition-transform duration-200 hover:scale-105">
      <div class="bg-yellow-400 text-black text-3xl lg:text-2xl px-5 py-2 rounded-t-xl shadow font-bold">1</div>
      <div class="bg-yellow-100 w-full h-64 md:h-80 rounded-b-xl flex flex-col justify-center items-center shadow-xl border-[6px] border-yellow-400 border-t-0 px-4">
        <slot name="firstPodiumSlot" />
      </div>
    </div>

    <!-- Locul 3 -->
    <div v-if="top3[2]" class="flex flex-col items-center w-72 md:w-52 transition-transform duration-200 hover:scale-105">
      <div class="bg-orange-500 text-white text-3xl lg:text-2xl px-5 py-2 rounded-t-xl shadow font-bold">3</div>
      <div class="bg-orange-100 w-full h-52 md:h-64 rounded-b-xl flex flex-col justify-center items-center shadow-md border-[6px] border-black border-t-0 px-4">
        <slot name="thirdPodiumSlot" />
      </div>
    </div>
  </div>
</template>