<template>
  <main class="">
    <!-- Header Section -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
      <p class="text-gray-500 text-sm mt-1">Monitor your election management system</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="itm in 4" :key="itm" class="h-28 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Users Card -->
      <div 
        @click="handleSelectedCardNavigation('registered')" 
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-[0.5px] border-gray-100 hover:border-green-300"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-green-50 rounded-lg p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-green-600">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
            </div>
          </div>
          
          <div>
            <p class="text-xs text-gray-500 mb-1">Total Users</p>
            <h4 class="text-2xl font-semibold text-gray-800">{{ usersList?.length ?? 0 }}</h4>
          </div>
        </div>
        <div class="border-t border-gray-100 px-4 py-2">
          <p class="text-xs text-gray-400">Registered voters</p>
        </div>
      </div>

      <!-- Approved Votes Card -->
      <div 
        @click="handleSelectedCardNavigation('approved')" 
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-[0.5px] border-gray-100 hover:border-blue-300"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-blue-50 rounded-lg p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-blue-600">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <p class="text-xs text-gray-500 mb-1">Approved Votes</p>
            <h4 class="text-2xl font-semibold text-gray-800">{{ approvedMatric?.length ?? 0 }}</h4>
          </div>
        </div>
        <div class="border-t border-gray-100 px-4 py-2">
          <p class="text-xs text-gray-400">Verified submissions</p>
        </div>
      </div>

      <!-- Pending Votes Card -->
      <div 
        @click="handleSelectedCardNavigation('rejected')" 
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-[0.5px] border-gray-100 hover:border-amber-300"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-amber-50 rounded-lg p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-amber-600">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <p class="text-xs text-gray-500 mb-1">Pending Votes</p>
            <h4 class="text-2xl font-semibold text-gray-800">{{ rejectedMatric?.length ?? 0 }}</h4>
          </div>
        </div>
        <div class="border-t border-gray-100 px-4 py-2">
          <p class="text-xs text-gray-400">Awaiting review</p>
        </div>
      </div>

      <!-- Candidates Card -->
      <div 
        @click="handleSelectedCardNavigation('candidates')" 
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-[0.5px] border-gray-100 hover:border-green-300"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-green-50 rounded-lg p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-green-600">
                <path d="M5.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM2.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM18.75 7.5a.75.75 0 00-1.5 0v2.25H15a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
            </div>
          </div>
          
          <div>
            <p class="text-xs text-gray-500 mb-1">Electoral Candidates</p>
            <h4 class="text-2xl font-semibold text-gray-800">{{ candidates?.length ?? 0 }}</h4>
          </div>
        </div>
        <div class="border-t border-gray-100 px-4 py-2">
          <p class="text-xs text-gray-400">Active candidates</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const router = useRouter()
const handleSelectedCardNavigation = (item: string) => {
  router.push(`/dashboard/election/users?type=${item}`)

  if(item === 'candidates'){
    router.push('/dashboard/candidates')
  }
}

const props = defineProps({
  loading: {
    type: Boolean
  },
  loadingCandidates: {
    type: Boolean
  },
  usersList: {
    type: Array
  },
  candidates: {
    type: Array
  },
  approvedMatric: {
    type: Array
  },
  rejectedMatric: {
    type: Array
  }
})
</script>