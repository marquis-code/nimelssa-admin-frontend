<template>
    <div class="bg-[#F3F2F2] space-y-3">
        <div class="md:flex space-y-4 md:space-y-0 justify-between items-center">
            <div>
                <p class="text-[#ACAFAE] py-0 my-0 text-sm md:text-lg font-medium">
                    Today, 9 January
                </p>
                <h1 class="py-0 my-0 text-xl">3h 50m</h1>
            </div>
            <div class="flex items-center gap-x-3">
                <select class="text-sm outline-none font-medium bg-gray-100 rounded-md px-2.5 py-2 w-full">
                    <option>Daily</option>
                    <option>Monthly</option>
                </select>
            </div>
        </div>
        <client-only>
            <div class="chart-wrapper md:w-full overflow-x-auto">
                <apexchart class="md:w-full overflow-x-auto" width="1000" height="400" type="pie"
                    :options="chartOptions" :series="series"></apexchart>
            </div>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFetchAllUsers } from '@/composables/user/getAllUsers';

const { usersByLevel, fetchUsers, loading } = useFetchAllUsers();

onMounted(() => {
    fetchUsers();
});

const calculateCompletion = (users, totalUsers) => {
    return totalUsers > 0 ? Math.min(Math.floor((users.length / totalUsers) * 100), 100) : 0;
};

const levelsData = [
    { name: '200 Level', total: 113, users: usersByLevel(200) },
    { name: '300 Level', total: 69, users: usersByLevel(300) },
    { name: '400 Level', total: 49, users: usersByLevel(400) },
    { name: '500 Level', total: 45, users: usersByLevel(500) },
];

const levels = computed(() => {
    return levelsData.map(level => ({
        ...level,
        users: level.users.value,
        completion: calculateCompletion(level.users.value, level.total)
    }));
});

const chartOptions = ref({
    chart: {
        id: "vuechart-example",
        toolbar: { show: false },
        type: "pie",
    },
    labels: levelsData.map(level => level.name),
    colors: [
        "#00FF00", // green
        "#FF0000", // red
        "#0000FF", // blue
        "#FFFF00", // yellow
    ],
    tooltip: {
        theme: "light",
        fillSeriesColor: false,
    },
});

const series = ref(levels.value.map(level => level.completion));
</script>

<style scoped></style>
