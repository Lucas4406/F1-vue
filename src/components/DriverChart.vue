<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from "vue-chartjs";
import { computed, watch } from "vue";
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

const chartOptions = {
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
        precision: 0 // Force integer display
      }
    },
    y: {
      ticks: {
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  },
};
</script>
