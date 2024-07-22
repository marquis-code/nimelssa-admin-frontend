<template>
    <main>
      <div>
        <div class="">
          <div class="border-b border-gray-200 border rounded-t-lg">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700" -->
              <a
                href.prevent="#"
                @click="handleTab('registered')"
                :class="[ route.query.type === 'registered' ? 'bg-indigo-100 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700']"
                class="flex cursor-pointer whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
              >
                Registered Voters
                <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
                <span
                  class="ml-3 hidden rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900 md:inline-block"
                  >{{usersList.length ?? 0}}</span
                >
              </a>
              <a
                href.prevent="#"
                @click="handleTab('approved')"
                :class="[ route.query.type === 'approved' ? 'bg-indigo-100 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700']"
                class="flex cursor-pointer whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
              >
                Approved Voters
                <span
                  class="ml-3 hidden rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900 md:inline-block"
                  >{{ approvedUsers.length ?? 0}}</span
                >
              </a>
              <a
                href.prevent="#"
                @click="handleTab('rejected')"
                :class="[ route.query.type === 'rejected' ? 'bg-indigo-100 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700']"
                class="flex cursor-pointer whitespace-nowrap border-b-2 border-indigo-500 px-3 py-3 text-sm font-medium text-indigo-600"
                aria-current="page"
              >
                Pending Voters
                <span
                  class="ml-3 hidden rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600 md:inline-block"
                  >{{ notApprovedUsers.length ?? 0}}</span
                >
              </a>

              <!-- <a
              href.prevent="#"
              @click="handleTab('invalid')"
              :class="[ route.query.type === 'invalid' ? 'bg-indigo-100 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700']"
              class="flex cursor-pointer whitespace-nowrap border-b-2 border-indigo-500 px-3 rounded-t-xl py-3 text-sm font-medium text-indigo-600"
              aria-current="page"
            >
              Invalid Voters
              <span
                class="ml-3 hidden rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600 md:inline-block"
                >4</span
              >
            </a> -->
            </nav>
          </div>
        </div>
      </div>
      <div class="border border-gray-300 rounded-b-xl p-3">
        <div class="sm:flex sm:items-center border p-3 rounded bg-white">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-gray-900">{{computedTitle}}</h1>
            <p class="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title,
              email and role.
            </p>
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          </div>
        </div>
       <div v-if="route.query.type === 'registered'">
        <UsersList :users="usersList" v-if="usersList.length >= 0 && !loading" />
       </div>
       <div v-if="route.query.type === 'approved'">
        <ApprovedUsers :users="approvedUsers" v-if="approvedUsers.length >= 0 && !loading"  />
       </div>
       <div v-if="route.query.type === 'rejected'">
        <RejectedUsers :users="notApprovedUsers" v-if="notApprovedUsers.length >= 0 && !loading" />
       </div>
        <div v-if="loading" class="h-32 mt-2 bg-slate-200 rounded animate-pulse"></div>
        <CoreEmptyState v-if="usersList.length <= 0 && !loading" title="No User available" desc="">
        </CoreEmptyState>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import { useFetchAllUsers } from '@/composables/user/getAllUsers'
  const { usersList, loading, approvedUsers, notApprovedUsers } = useFetchAllUsers()
  const route = useRoute()
  const router = useRouter()
definePageMeta({
    layout: 'dashboard'
})

const handleTab = (item: string) => {
  console.log(item, 'item here')
  router.push({
    path: route.path,
    query: {
      ...route.query,
      type: item
    }
  })
}

const computedTitle = computed(() => {
   const titleMap = {
    registered: 'Registered Voters',
    approved: 'Approved Voters',
    rejected: 'Rejected Voters',
    invalid: 'Invalid Voters'
   }

   return titleMap[route.query.type]
})
</script>