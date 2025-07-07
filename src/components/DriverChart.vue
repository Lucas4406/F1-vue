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
  drivers: {
    type: Array,
    required: true,
  },
});

// Ref to access the Bar component instance
const chartRef = ref(null);

// Creează datele graficului din props
const chartData = computed(() => ({
  labels: props.drivers.map(
      (d) => `${d.driverData.driverFirstName} ${d.driverData.driverLastName}`
  ),
  datasets: [
    {
      label: "Votes",
      data: props.drivers.map((d) => d.count),
      backgroundColor: props.drivers.map(
          (d) => `#${d.driverData.teamColourCode}`
      ),
      borderRadius: 5,
    },
  ],
}));

// Use a ref to track the dark mode status
const isDarkMode = ref(false);

// Function to update dark mode status
const updateDarkModeStatus = () => {
  isDarkMode.value = document.documentElement.classList.contains("darkmode");
};

// Update status on mount and listen for changes
onMounted(() => {
  updateDarkModeStatus();
  // You might need an observer if the class is toggled without a full page reload
  const observer = new MutationObserver(updateDarkModeStatus);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  onBeforeUnmount(() => {
    observer.disconnect();
  });
});

// chartOptions as a computed property to react to isDarkMode changes
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
        precision: 0, // Force integer display
        font: {
          size: 18,
          weight: 'bold',
        },
        color: isDarkMode.value ? "#fff" : "#000", // Dynamically set color based on isDarkMode
      }
    },
    y: {
      ticks: {
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode.value ? "#fff" : "#000", // Dynamically set color based on isDarkMode
      },
    },
  },
}));

// Watch for changes in isDarkMode and force chart update
watch(isDarkMode, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (chartRef.value && chartRef.value.chart) {
      // Access the underlying Chart.js instance and call update()
      chartRef.value.chart.update();
    }
  }
});
</script>