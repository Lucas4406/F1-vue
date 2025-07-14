<template>
  <div class="bg-gray-900 p-6 lg:p-8 rounded-lg font-sans w-auto">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-extrabold text-white mb-6">{{ sessionName }}</h2>

      <p v-if="localStartTime" class="text-lg text-gray-400 mb-6 font-mono">
        {{ localStartTime }}
      </p>

      <div class="shadow-lg rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-lg lg:text-md text-left text-gray-300">
            <thead class="text-xs text-gray-400 uppercase bg-gray-800">
            <tr>
              <th scope="col" class="px-4 py-3 sm:px-6">Pos</th>
              <th scope="col" class="px-4 py-3 sm:px-6">Driver</th>
              <th scope="col" class="px-4 py-3 sm:px-6 hidden md:table-cell">Team</th>
              <th scope="col" class="px-4 py-3 sm:px-6">Q1</th>
              <th scope="col" class="px-4 py-3 sm:px-6">Q2</th>
              <th scope="col" class="px-4 py-3 sm:px-6">Q3</th>
              <th scope="col" class="px-4 py-3 sm:px-6">Laps</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="result in results.slice(0, shownResultsCount)"
                :key="result.driverReference"
                class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
            >
              <td
                  class="px-4 sm:px-6 py-4 font-bold text-base text-white text-center"
                  :style="{ 'border-left': `4px solid #${result.teamColourCode}` }"
              >
                {{ result.positionNumber }}
              </td>

              <td class="px-4 sm:px-6 py-4">
                <div class="flex items-center">
                  <img
                      :src="getDriverImageUrl(result.driverAvatarImage)"
                      @error="handleImageError"
                      alt="Driver Avatar"
                      class="w-10 h-10 rounded-full mr-4 object-cover"
                  >
                  <span class="font-medium text-white whitespace-nowrap">
                      {{ result.driverFirstName }} {{ result.driverLastName }}
                    </span>
                </div>
              </td>

              <td class="px-4 sm:px-6 py-4 text-gray-400 whitespace-nowrap hidden md:table-cell text-center">
                {{ result.displayTeamName }}
              </td>

              <td class="px-4 sm:px-6 py-4 font-mono text-gray-300 text-center">
                {{ result.q1 ? result.q1.displayTime : '—' }}
              </td>

              <td class="px-4 sm:px-6 py-4 font-mono text-gray-300 text-center">
                {{ result.q2 ? result.q2.displayTime : '—' }}
              </td>

              <td class="px-4 sm:px-6 py-4 font-mono text-white text-center">
                {{ result.q3 ? result.q3.displayTime : '—' }}
              </td>

              <td class="px-4 sm:px-6 py-4 font-medium text-gray-300 text-center">
                {{ result.lapsCompleted }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="shownResultsCount < results.length" class="text-center mt-4">
        <button
            @click="showMore"
            class="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 transition duration-300 cursor-pointer text-lg lg:text-base rounded-lg"
        >
          Show more
        </button>
      </div>

      <p class="text-lg text-gray-500 mt-4 text-left source">
        Showing {{ results.length }} drivers. Team colors indicate constructor.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; // Make sure computed is imported
import { formatGmtToLocal } from '@/functions/timeFormat'; // 1. Import the new function

const props = defineProps({
  results: {
    type: Array,
    required: true,
  },
  sessionName: {
    type: String,
    required: true,
  },
  // 2. Add a new prop to receive the full session object
  sessionInfo: {
    type: Object,
    required: true,
  }
});

// 3. Create a computed property to format the start time
const localStartTime = computed(() => {
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit'
  };
  return formatGmtToLocal(props.sessionInfo.startTime, props.sessionInfo.gmtOffset, options);
});

const shownResultsCount = ref(5);

const showMore = () => {
  shownResultsCount.value = props.results.length;
};

const getDriverImageUrl = (avatarImage) => {
  if (!avatarImage?.public_id) {
    return 'https://placehold.co/100x100/374151/FFFFFF?text=N/A';
  }
  return `https://media.formula1.com/image/upload/f_auto,c_fill,g_auto,w_100,h_100/${avatarImage.public_id}.png`;
};

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/100x100/374151/FFFFFF?text=N/A';
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&family=Roboto+Mono&display=swap');

.font-sans {
  font-family: 'Titillium Web', sans-serif;
}

.font-mono {
  font-family: 'Roboto Mono', monospace;
}
</style>