<template>
  <div class="max-w-2xl mx-auto p-4 font-sans">
    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-2xl mb-6">
      <h2 class="text-3xl font-bold text-center mb-1">F1 Live Position Replay</h2>
      <p class="text-center text-sm text-gray-400 mb-6">
        Simulating: Monaco Grand Prix 2024 (Session 9967)
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
            @click="playReplay"
            :disabled="isReplaying || !fullPositionHistory.length"
            class="w-full sm:w-auto bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200 ease-in-out shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
          Play
        </button>
        <button
            @click="pauseReplay"
            :disabled="!isReplaying"
            class="w-full sm:w-auto bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200 ease-in-out shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm6 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          Pause
        </button>
        <button
            @click="resetReplay"
            :disabled="!fullPositionHistory.length"
            class="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200 ease-in-out shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2M9 15h4.581" /></svg>
          Reset
        </button>
      </div>

      <label class="flex flex-col items-center space-y-2 text-sm">
        <span class="font-medium">Replay Speed:</span>
        <div class="flex items-center space-x-3 w-full max-w-xs">
          <input
              type="range"
              min="10"
              max="3000"
              step="100"
              v-model.number="simulationSpeedMs"
              @input="handleSpeedChange"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              :disabled="!fullPositionHistory.length"
          />
          <span class="text-sm w-16 text-right">{{ simulationSpeedMs }}ms</span>
        </div>
      </label>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-lg text-gray-600">Loading race data...</p>
      <!-- You can add a spinner here -->
    </div>

    <div v-else-if="!fullPositionHistory.length && !isLoading" class="text-center py-10">
      <p class="text-lg text-red-500">Could not load race data. Please try again later.</p>
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-xl rounded-lg">
      <table class="w-full min-w-max border-collapse">
        <thead class="sticky top-0 bg-gray-100 z-10">
        <tr class="bg-gray-700 text-white">
          <th class="p-3 text-left text-xs font-semibold uppercase tracking-wider">Pos</th>
          <th class="p-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
          <th class="p-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
          <th class="p-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Team</th>
          <th class="p-3 text-left text-xs font-semibold uppercase tracking-wider sm:hidden">Team</th>
        </tr>
        </thead>
        <transition-group tag="tbody" name="list" class="list-move">
          <tr
              v-for="driver in sortedDrivers"
              :key="driver.driver_number"
              class="border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-in-out"
              :class="[
              positionChanges[driver.driver_number] === 'up' ? 'bg-green-50 text-green-700 font-medium' :
              positionChanges[driver.driver_number] === 'down' ? 'bg-red-50 text-red-700 font-medium' : ''
            ]"
          >
            <td class="p-3 text-sm font-semibold text-gray-700 w-12 text-center">{{ driver.position }}</td>
            <td class="p-3 text-sm font-mono text-gray-600 w-12">#{{ driver.driver_number }}</td>
            <td class="p-3 text-sm text-gray-800">{{ driver.full_name }}</td>
            <td class="p-3 text-sm text-gray-600 hidden sm:table-cell">{{ driver.team_name }}</td>
            <td class="p-3 text-sm text-gray-600 sm:hidden" :title="driver.team_name">{{ driver.team_name ? driver.team_name.substring(0,3).toUpperCase() : 'N/A' }}</td>
          </tr>
        </transition-group>
      </table>
      <div v-if="sortedDrivers.length === 0 && currentVisibleTime" class="p-4 text-center text-gray-500">
        Waiting for drivers to cross the start line...
      </div>
    </div>
    <div v-if="currentVisibleTime && fullPositionHistory.length" class="mt-4 text-center text-xs text-gray-500">
      Simulated Race Time: {{ new Date(currentVisibleTime).toLocaleTimeString() }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Configuration for the specific session to replay
const MEETING_KEY = 1262;
const SESSION_KEY = 9971;

// Driver and Position Data
const allDriversInfo = ref({}); // Stores { driver_number: { full_name, team_name } }
const fullPositionHistory = ref([]); // Stores all position entries for the session, sorted by date

// Simulation State
const simulationSpeedMs = ref(500); // User-controlled speed for interval
const isReplaying = ref(false);
let replayTimerId = null;
const currentVisibleTime = ref(null); // Timestamp of the current simulation moment
const runningFramePositions = ref({}); // { driver_number: { position, date, full_name, team_name, ... } }
let lastProcessedHistoryIndex = -1; // Optimization for processing fullPositionHistory

// Display State
const latestDisplayedPositions = ref([]); // Array of driver objects for the table
const previousDisplayedPositionsMap = ref({}); // { driver_number: { position } } for change detection
const positionChanges = ref({}); // { driver_number: 'up' | 'down' | null } for styling
const isLoading = ref(true);


// Fetch all driver information
const fetchAllDrivers = async () => {
  try {
    // Using specific session_key for drivers to match position data if available,
    // otherwise fallback to 'latest'. OpenF1 driver_number is usually persistent.
    let driversData;
    try {
      const resDriversSpecific = await fetch(`https://api.openf1.org/v1/drivers?session_key=${SESSION_KEY}`);
      if (!resDriversSpecific.ok) throw new Error('Specific session drivers not found, trying latest.');
      driversData = await resDriversSpecific.json();
      if (!driversData || driversData.length === 0) throw new Error('No drivers from specific session, trying latest.');
    } catch (e) {
      console.warn(`Failed to fetch drivers for session ${SESSION_KEY}, trying session_key=latest: ${e.message}`);
      const resDriversLatest = await fetch('https://api.openf1.org/v1/drivers?session_key=latest');
      if (!resDriversLatest.ok) throw new Error('Failed to fetch drivers with session_key=latest.');
      driversData = await resDriversLatest.json();
    }

    const lookup = {};
    for (const d of driversData) {
      lookup[d.driver_number] = {
        full_name: d.full_name || 'Unknown Driver',
        team_name: d.team_name || 'Unknown Team',
      };
    }
    allDriversInfo.value = lookup;
  } catch (error) {
    console.error('Failed to fetch all drivers:', error);
    // Allow app to continue, names/teams might be missing
  }
};

// Fetch all position data for the entire session
const fetchFullPositionHistoryForSession = async () => {
  try {
    const res = await fetch(`https://api.openf1.org/v1/position?meeting_key=${MEETING_KEY}&session_key=${SESSION_KEY}`);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data || data.length === 0) {
      console.warn('No position data returned from API.');
      fullPositionHistory.value = [];
      return;
    }
    // Sort by date to ensure chronological order
    fullPositionHistory.value = data.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Failed to fetch position history:', error);
    fullPositionHistory.value = []; // Ensure it's an empty array on error
  }
};

// Update the table based on the current state of runningFramePositions
const updateTableDisplay = () => {
  if (currentVisibleTime.value === null && fullPositionHistory.value.length > 0) {
    // Initialize currentVisibleTime to the first entry's time if not set
    currentVisibleTime.value = new Date(fullPositionHistory.value[0].date).getTime();
  }

  // Iterate through fullPositionHistory to update runningFramePositions
  // Start from lastProcessedHistoryIndex + 1 for efficiency
  for (let i = lastProcessedHistoryIndex + 1; i < fullPositionHistory.value.length; i++) {
    const entry = fullPositionHistory.value[i];
    const entryTime = new Date(entry.date).getTime();

    if (entryTime <= currentVisibleTime.value) {
      runningFramePositions.value[entry.driver_number] = {
        ...entry, // Raw position data (driver_number, position, date)
        ...(allDriversInfo.value[entry.driver_number] || { full_name: `Driver ${entry.driver_number}`, team_name: 'N/A' }) // Merge driver info
      };
      lastProcessedHistoryIndex = i;
    } else {
      // Since history is sorted, we can break if entry is past currentVisibleTime
      break;
    }
  }

  const newChanges = {};
  const currentPositionsArray = [];

  for (const driverNumStr in runningFramePositions.value) {
    const currentInfo = runningFramePositions.value[driverNumStr];
    currentPositionsArray.push(currentInfo);

    const prevInfo = previousDisplayedPositionsMap.value[driverNumStr];
    if (prevInfo && typeof prevInfo.position === 'number' && typeof currentInfo.position === 'number') {
      if (currentInfo.position < prevInfo.position) newChanges[driverNumStr] = 'up';
      else if (currentInfo.position > prevInfo.position) newChanges[driverNumStr] = 'down';
    }
  }

  positionChanges.value = newChanges;

  // Update previousDisplayedPositionsMap for the next frame's comparison
  const newPreviousMap = {};
  currentPositionsArray.forEach(p => {
    newPreviousMap[p.driver_number] = { position: p.position };
  });
  previousDisplayedPositionsMap.value = newPreviousMap;

  latestDisplayedPositions.value = currentPositionsArray;
};


// Simulation Controls
function playReplay() {
  if (!fullPositionHistory.value.length) return;
  isReplaying.value = true;

  if (replayTimerId) clearInterval(replayTimerId);

  // If currentVisibleTime is at the end (or not set), reset to start
  const lastEntryTime = fullPositionHistory.value.length > 0 ? new Date(fullPositionHistory.value[fullPositionHistory.value.length - 1].date).getTime() : 0;
  if (currentVisibleTime.value === null || currentVisibleTime.value >= lastEntryTime) {
    resetSimulationStateVars(); // Resets time and processing state
    if (fullPositionHistory.value.length > 0) {
      currentVisibleTime.value = new Date(fullPositionHistory.value[0].date).getTime();
    }
  }

  // Initial update before interval starts
  updateTableDisplay();

  replayTimerId = setInterval(() => {
    if (!isReplaying.value || currentVisibleTime.value === null) {
      clearInterval(replayTimerId);
      return;
    }

    currentVisibleTime.value += simulationSpeedMs.value;

    if (currentVisibleTime.value > lastEntryTime && fullPositionHistory.value.length > 0) {
      currentVisibleTime.value = lastEntryTime; // Snap to final state
      updateTableDisplay(); // Ensure final state is displayed
      pauseReplay(); // Stop at the end
      return;
    }
    updateTableDisplay();
  }, simulationSpeedMs.value);
}

function pauseReplay() {
  isReplaying.value = false;
  clearInterval(replayTimerId);
  replayTimerId = null;
}

function resetReplay() {
  pauseReplay();
  resetSimulationStateVars();
  if (fullPositionHistory.value.length > 0) {
    currentVisibleTime.value = new Date(fullPositionHistory.value[0].date).getTime();
    updateTableDisplay(); // Show initial state
  } else {
    latestDisplayedPositions.value = []; // Clear table if no data
  }
}

// Helper to reset simulation variables
function resetSimulationStateVars() {
  runningFramePositions.value = {};
  lastProcessedHistoryIndex = -1;
  previousDisplayedPositionsMap.value = {};
  positionChanges.value = {};
  if (fullPositionHistory.value.length > 0) {
    currentVisibleTime.value = new Date(fullPositionHistory.value[0].date).getTime();
  } else {
    currentVisibleTime.value = null;
  }
}


function handleSpeedChange() {
  // simulationSpeedMs is already updated by v-model
  if (isReplaying.value) {
    // Restart the interval with the new speed
    pauseReplay();
    playReplay();
  }
}

// Computed property to sort drivers for display
const sortedDrivers = computed(() =>
    [...latestDisplayedPositions.value].sort((a, b) => {
      if (typeof a.position !== 'number') return 1; // Put drivers without a numeric position last
      if (typeof b.position !== 'number') return -1;
      return a.position - b.position;
    })
);

// Lifecycle Hooks
onMounted(async () => {
  isLoading.value = true;
  await fetchAllDrivers();
  await fetchFullPositionHistoryForSession();

  if (fullPositionHistory.value.length > 0) {
    resetSimulationStateVars(); // Initialize simulation state
    currentVisibleTime.value = new Date(fullPositionHistory.value[0].date).getTime();
    updateTableDisplay(); // Display initial state
  } else {
    console.warn("No position history data to display.");
  }
  isLoading.value = false;
});

onUnmounted(() => {
  clearInterval(replayTimerId);
  replayTimerId = null;
});

</script>

<style scoped>
/* Styles for the transition-group for smooth reordering */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.7s cubic-bezier(0.55, 0, 0.1, 1); /* Smoother bezier curve */
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Can also use scale or X transform */
}

/* Ensure leaving items are absolutely positioned to not affect layout during transition */
.list-leave-active {
  position: absolute;
  width: 100%; /* Maintain width during leave transition */
}

/* Custom scrollbar for table container if needed */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Style for range input */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4CAF50; /* Green thumb */
  cursor: pointer;
  border-radius: 50%;
  margin-top: -7px; /* Adjust to center thumb on track */
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4CAF50;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

</style>
