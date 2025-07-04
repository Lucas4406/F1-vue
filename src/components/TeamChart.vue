<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from "vue-chartjs";
import { computed } from "vue";
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
