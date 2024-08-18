<template>
  <div class="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
    <div class="relative flex flex-col bg-clip-border border border-gray-200 rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
      <div class="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
        <div>
          <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">Electon Registeration Statistics</h6>
        </div>
      </div>
      <div class="p-6 overflow-x-scroll px-0 pt-0 pb-2">
        <table class="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Classes</p>
              </th>
              <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Total Students</p>
              </th>
              <th class="border-b border-blue-gray-50 py-3 px-6 text-left">
                <p class="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Completion</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(level, index) in levels" :key="index">
              <td class="py-6 px-5 border-b border-blue-gray-500">
                <div class="flex items-center gap-4">
                  <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{{ level.name }}</p>
                </div>
              </td>
              <td class="py-3 px-5 border-b border-blue-gray-500">
                <p class="block antialiased font-sans text-xs font-medium text-blue-gray-600">{{ level.users.length }}</p>
              </td>
              <td class="py-3 px-5 border-b border-blue-gray-500">
                <div class="w-10/12">
                  <p class="antialiased font-sans mb-1 block text-xs font-medium text-blue-gray-600">{{ level.completion }}%</p>
                  <div class="flex flex-start bg-gray-200 overflow-hidden w-full rounded-sm font-sans text-xs font-medium h-1">
                    <div class="flex justify-center items-center h-full bg-green-500 text-white" :style="{ width: level.completion + '%' }"></div>
                    <div class="flex justify-center items-center h-full bg-gray-200 text-white" :style="{ width: (100 - level.completion) + '%' }"></div>
                  </div>
                </div>
              </td>
            </tr>      
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import { useFetchAllUsers } from '@/composables/user/getAllUsers';

const { usersByLevel, loading, usersList } = useFetchAllUsers();

const calculateCompletion = (users: any, totalUsers: any) => {
  return totalUsers > 0 ? Math.min(Math.floor((users.length / totalUsers) * 100), 100) : 0;
};

const levels = computed(() => {
  const levelsData = [
    { name: '200 Level', total: 113, users: usersByLevel(200) },
    { name: '300 Level', total: 69, users: usersByLevel(300) },
    { name: '400 Level', total: 60, users: usersByLevel(400) },
    { name: '500 Level', total: 46, users: usersByLevel(500) },
  ];

  return levelsData.map(level => ({
    ...level,
    users: level.users.value,
    completion: calculateCompletion(level.users.value, level.total)
  }));
});
</script> -->

<script setup lang="ts">
import { computed, ref } from 'vue';
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
</script>
