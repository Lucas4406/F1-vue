<template>
  <Bar :data="chartData" :options="chartOptions" ref="chartRef" />
</template>

<script setup>
import { Bar } from "vue-chartjs";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
});

const chartRef = ref(null); // Ref to access the Bar component instance

const chartData = computed(() => ({
  labels: props.teams.map((t) => t.teamData.displayTeamName),
  datasets: [
    {
      label: "Votes",
      data: props.teams.map((t) => t.count),
      backgroundColor: props.teams.map((t) => `#${t.teamData.teamColourCode}`),
      borderRadius: 5,
    },
  ],
}));

const isDarkMode = ref(false);

const updateDarkModeStatus = () => {
  isDarkMode.value = document.documentElement.classList.contains("darkmode");
};

onMounted(() => {
  updateDarkModeStatus();
  const observer = new MutationObserver(updateDarkModeStatus);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  onBeforeUnmount(() => {
    observer.disconnect();
  });
});

const chartOptions = computed(() => ({
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Votes: ${context.parsed.x}`;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        font: {
          size: 18,
          weight: 'bold',
        },
        color: isDarkMode.value ? "#fff" : "#000",
      }
    },
    y: {
      ticks: {
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode.value ? "#fff" : "#000",
      },
    },
  },
}));

// --- New part to force update ---
watch(isDarkMode, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (chartRef.value && chartRef.value.chart) {
      // Access the underlying Chart.js instance and call update()
      chartRef.value.chart.update();
    }
  }
});
// --- End of new part ---
</script>