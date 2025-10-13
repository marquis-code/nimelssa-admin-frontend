<template>
  <div class="mb-4">
    <div class="bg-white border-[0.5px] border-gray-100 rounded-lg shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100">
        <h6 class="text-base font-semibold text-gray-800">Election Registration Statistics</h6>
        <p class="text-sm text-gray-500 mt-1">Student registration by class level</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-12 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class Level
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Students
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(level, index) in levels" :key="index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 bg-green-50 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-semibold text-green-600">{{ level.name.split(' ')[0] }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-800">{{ level.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-gray-900">{{ level.users.length }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ level.total }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-1 max-w-xs">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-medium text-gray-600">{{ level.completion }}%</span>
                      <span class="text-xs text-gray-400">{{ level.users.length }}/{{ level.total }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        class="h-full rounded-full transition-all duration-300"
                        :class="getProgressColor(level.completion)"
                        :style="{ width: level.completion + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && levels.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p class="mt-1 text-sm text-gray-500">Registration statistics will appear here.</p>
      </div>

      <!-- Footer Summary -->
      <div v-if="!loading && levels.length > 0" class="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Total Registered:</span>
          <span class="font-semibold text-gray-900">{{ totalRegistered }} / {{ totalStudents }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFetchAllUsers } from '@/composables/user/getAllUsers';

const { usersByLevel, loading, usersList } = useFetchAllUsers();

// Debugging: Log fetched user data
console.log("Users by Level:", {
  200: usersByLevel(200).value,
  300: usersByLevel(300).value,
  400: usersByLevel(400).value,
  500: usersByLevel(500).value
});

const calculateCompletion = (users: any[], totalUsers: number) => {
  if (!users || !Array.isArray(users)) {
    console.error("Invalid users array:", users);
    return 0;
  }
  return totalUsers > 0 ? Math.min(Math.floor((users.length / totalUsers) * 100), 100) : 0;
};

const getProgressColor = (completion: number) => {
  if (completion >= 75) return 'bg-green-500';
  if (completion >= 50) return 'bg-blue-500';
  if (completion >= 25) return 'bg-amber-500';
  return 'bg-red-500';
};

const levels = computed(() => {
  const levelsData = [
    { name: '200 Level', total: 113, users: usersByLevel(200).value },
    { name: '300 Level', total: 69, users: usersByLevel(300).value },
    { name: '400 Level', total: 60, users: usersByLevel(400).value },
    { name: '500 Level', total: 46, users: usersByLevel(500).value },
  ];

  return levelsData.map(level => {
    const users = level.users || [];
    const completion = calculateCompletion(users, level.total);
    
    // Debugging: Log each level's data and calculated completion
    console.log(`Level: ${level.name}`, { users, completion });

    return {
      ...level,
      users,
      completion
    };
  });
});

const totalRegistered = computed(() => {
  return levels.value.reduce((sum, level) => sum + level.users.length, 0);
});

const totalStudents = computed(() => {
  return levels.value.reduce((sum, level) => sum + level.total, 0);
});
</script>