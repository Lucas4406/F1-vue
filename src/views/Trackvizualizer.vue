<template>
  <div class="max-w-xl mx-auto space-y-4">
    <h2 class="text-xl font-bold">Live F1 Positions</h2>

    <div class="flex items-center space-x-4">
      <button @click="play" class="bg-green-600 text-white px-3 py-1 rounded">Play</button>
      <button @click="pause" class="bg-red-600 text-white px-3 py-1 rounded">Pause</button>

      <label class="flex items-center space-x-2">
        <span class="text-sm">Speed:</span>
        <input type="range" min="1000" max="5000" step="500" v-model="speed" @input="logSpeed" />
        <span class="text-sm">{{ speed }}ms</span>
      </label>
    </div>

    <table class="w-full border-collapse">
      <thead>
      <tr class="bg-gray-800 text-white">
        <th class="p-2 text-left">#</th>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Team</th>
        <th class="p-2 text-left">Position</th>
      </tr>
      </thead>
      <transition-group tag="tbody" name="list" class="list-move">
        <tr
            v-for="driver in sortedDrivers"
            :key="driver.driver_number"
            :class="[
    'transition-all duration-300',
    changes[driver.driver_number] === 'up' ? 'bg-green-100' :
    changes[driver.driver_number] === 'down' ? 'bg-red-100' : ''
  ]"
        >
          <td class="p-2 font-mono">#{{ driver.driver_number }}</td>
          <td class="p-2">{{ driver.full_name }}</td>
          <td class="p-2">{{ driver.team_name }}</td>
          <td class="p-2">{{ driver.position }}</td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const latestPositions = ref([]);
const previousPositions = ref({});
const changes = ref({});
const playing = ref(false);
const speed = ref(3000);
let intervalId = null;

const driversLookup = ref({}); // driver_number -> { full_name, team_name }

const fetchAllDrivers = async () => {
  try {
    const res = await fetch('https://api.openf1.org/v1/drivers?session_key=latest');
    const data = await res.json();

    const lookup = {};
    for (const d of data) {
      lookup[d.driver_number] = {
        full_name: `${d.full_name}`,
        team_name: d.team_name || 'Unknown',
      };
    }
    driversLookup.value = lookup;
  } catch (error) {
    console.error('Failed to fetch all drivers:', error);
  }
};

const fetchPositions = async () => {
  try {
    const res = await fetch('https://api.openf1.org/v1/position?meeting_key=1262&session_key=9967');
    const data = await res.json();

    const latestPerDriver = {};
    for (const entry of data) {
      const driver = entry.driver_number;
      const date = new Date(entry.date);

      if (!latestPerDriver[driver] || new Date(latestPerDriver[driver].date) < date) {
        latestPerDriver[driver] = { driver_number: driver, position: entry.position, date: entry.date };
      }
    }

    const newChanges = {};
    for (const [driverNum, info] of Object.entries(latestPerDriver)) {
      const prev = previousPositions.value[driverNum];
      if (prev) {
        if (info.position < prev.position) newChanges[driverNum] = 'up';
        else if (info.position > prev.position) newChanges[driverNum] = 'down';
        else newChanges[driverNum] = null;
      } else {
        newChanges[driverNum] = null;
      }

      if (driversLookup.value[driverNum]) {
        latestPerDriver[driverNum].full_name = driversLookup.value[driverNum].full_name;
        latestPerDriver[driverNum].team_name = driversLookup.value[driverNum].team_name;
      } else {
        latestPerDriver[driverNum].full_name = 'Unknown';
        latestPerDriver[driverNum].team_name = 'Unknown';
      }
    }

    changes.value = { ...newChanges };
    previousPositions.value = { ...latestPerDriver };

    // Clone deep ca să forțezi Vue să observe update-ul
    latestPositions.value = Object.values(latestPerDriver).map(d => ({ ...d }));

  } catch (error) {
    console.error('Failed to fetch positions:', error);
  }
};


const sortedDrivers = computed(() =>
    [...latestPositions.value].sort((a, b) => a.position - b.position)
);

function play() {
  if (!playing.value) {
    playing.value = true;
    console.log('▶️ Play');
    fetchPositions();
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(fetchPositions, speed.value);
  }
}

function pause() {
  if (playing.value) {
    playing.value = false;
    clearInterval(intervalId);
    intervalId = null;
    console.log('⏸️ Pause');
  }
}

function logSpeed() {
  console.log(`⏩ Speed changed to ${speed.value} ms`);
  if (playing.value) {
    clearInterval(intervalId);
    intervalId = setInterval(fetchPositions, speed.value);
  }
}

onMounted(async () => {
  await fetchAllDrivers();
  fetchPositions();
});

onUnmounted(() => {
  clearInterval(intervalId);
  intervalId = null;
});
</script>

<style scoped>
.list-move {
  transition: all 0.5s ease;
}
</style>
