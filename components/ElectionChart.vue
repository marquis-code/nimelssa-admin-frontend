<template>
  <div class="w-full space-y-6">
    <!-- Chart -->
    <div>
      <apexchart width="100%" type="bar" :options="chartOptions" :series="seriesData" />
    </div>
    
    <!-- Summary of Candidates -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold">Summary of Candidates</h2>
      <div v-for="(candidates, position) in filteredElectionData" :key="position" class="p-4 bg-gray-100 space-y-3 rounded shadow">
        <h3 class="text-sm font-semibold">{{ formatPosition(position) }}</h3>
        <div class="space-y-5">
          <div v-for="candidate in candidates" :key="candidate.candidate._id" class="flex items-center space-x-4">
            <CoreImageZoom v-if="candidate.candidate.image" class="h-10 w-10" :src="candidate.candidate.image" />
            <div class="flex-1">
              <p class="font-bold text-sm">{{ candidate.candidate.name }}</p>
              <p class="text-sm">Votes: {{ candidate.votes }} ({{ candidate.percentage }}%)</p>
              <p class="text-sm">Witheld votes: {{ 100 - candidate.percentage }}</p>
            </div>
            <span class="text-xs" :class="getLabelClass(candidate.status)">
              {{ candidate.status === 'Winner' ? 'Winner' : 'Not Enough Votes to Win' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import ApexCharts from 'vue3-apexcharts';

interface CandidateData {
  candidate: {
    _id: string;
    name: string;
    position: string;
    image: string;
  };
  votes: number;
  percentage: string;
  status: string;
}

interface ElectionData {
  [key: string]: CandidateData[];
}

const props = defineProps<{
  electionData: ElectionData | null;
}>();

const chartOptions = ref({
  chart: {
    type: 'bar',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [] as string[],
  },
  yaxis: {
    title: {
      text: 'Votes',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return `${val} votes`;
      },
    },
  },
});

const seriesData = ref([
  {
    name: 'Total Votes',
    data: [] as number[],
  },
]);

const filteredElectionData = computed(() => {
  if (!props.electionData) {
    return {};
  }
  
  // Remove "MATRICNUMBER" from the election data
  const filteredData: ElectionData = {};
  Object.keys(props.electionData).forEach((position) => {
    if (position.toUpperCase() !== 'MATRICNUMBER') {
      filteredData[position] = props.electionData[position];
    }
  });
  return filteredData;
});

const generateChartData = () => {
  if (!props.electionData || Object.keys(props.electionData).length === 0) {
    console.warn('Election data is undefined or empty.');
    return;
  }

  const categories: string[] = [];
  const data: number[] = [];

  Object.keys(filteredElectionData.value).forEach((position) => {
    const totalVotes = filteredElectionData.value[position].reduce((sum, candidate) => {
      return sum + candidate.votes;
    }, 0);
    categories.push(position.replace('_', ' ').toUpperCase());
    data.push(totalVotes);
  });

  chartOptions.value.xaxis.categories = categories;
  seriesData.value[0].data = data;
};

// Helper function to format position names
const formatPosition = (position: string) => {
  return position.replace('_', ' ').toUpperCase();
};

// Helper function to return label class based on status
const getLabelClass = (status: string) => {
  return status === 'Winner' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
};

onMounted(() => {
  generateChartData();
});

watch(() => props.electionData, generateChartData);
</script>

<style scoped>
</style>
