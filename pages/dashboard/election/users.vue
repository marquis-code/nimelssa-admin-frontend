<template>
  <main>
    <div>
      <div class="">
        <div class="border-b border-gray-200 border rounded-t-lg">
          <nav class="-mb-px grid grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Tabs">
            <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700" -->
            <a href.prevent="#" @click="handleTab('registered')" :class="[
              route.query.type === 'registered'
                ? 'bg-indigo-100 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
            ]"
              class="flex cursor-pointer whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700">
              Total Users
              <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
              <span
                class="ml-3 hidden rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900 md:inline-block">{{
                  usersList.length ?? 0 }}</span>
            </a>
            <a href.prevent="#" @click="handleTab('approved')" :class="[
              route.query.type === 'approved'
                ? 'bg-indigo-100 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
            ]"
              class="flex cursor-pointer whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700">
              Approved Voters
              <span
                class="ml-3 hidden rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900 md:inline-block">{{
                  approvedUsers.length ?? 0 }}</span>
            </a>
            <a href.prevent="#" @click="handleTab('rejected')" :class="[
              route.query.type === 'rejected'
                ? 'bg-indigo-100 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
            ]"
              class="flex cursor-pointer whitespace-nowrap border-b-2 border-indigo-500 px-3 py-3 text-sm font-medium text-indigo-600"
              aria-current="page">
              Pending Voters
              <span
                class="ml-3 hidden rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600 md:inline-block">{{
                  notApprovedUsers.length ?? 0 }}</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
    <div class="border border-gray-300 rounded-b-xl p-3">
      <div class="sm:flex sm:items-center border p-3 rounded bg-white space-y-4 lg:space-y-0">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">
            {{ computedTitle }}
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all the users in NIMELSSA including their name, matric,
            level and status.
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Filter by level</p>
          <select v-model="level" class="px-6 rounded-md outline-none">
            <option value="">Select level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
      </div>
      <div v-if="route.query.type === 'registered'">
        <UsersList :users="filteredTotalList" v-if="filteredTotalList.length >= 0 && !loading" />
      </div>
      <div v-if="route.query.type === 'approved'">
        <ApprovedUsers :users="filteredApprovedList" v-if="filteredApprovedList.length >= 0 && !loading" />
      </div>
      <div v-if="route.query.type === 'rejected'">
        <RejectedUsers :users="filteredRejectedList" v-if="filteredRejectedList.length >= 0 && !loading" />
      </div>
      <div v-if="loading" class="h-32 mt-2 bg-slate-200 rounded animate-pulse"></div>
      <CoreEmptyState v-if="usersList.length <= 0 && !loading" title="No User available" desc="">
      </CoreEmptyState>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useFetchAllUsers } from "@/composables/user/getAllUsers";
const { usersList, loading, approvedUsers, notApprovedUsers } =
  useFetchAllUsers();
const route = useRoute();
const router = useRouter();
definePageMeta({
  layout: "dashboard",
});

const handleTab = (item: string) => {
  console.log(item, "item here");
  router.push({
    path: route.path,
    query: {
      ...route.query,
      type: item,
    },
  });
};

const level = ref(null);

const filteredApprovedList = computed(() => {
  if (approvedUsers.value.length) {
    return approvedUsers.value.filter((user: any) => {
      return level.value ? user.level === level.value : true;
    });
  }
  return [];
});

const filteredRejectedList = computed(() => {
  if (notApprovedUsers.value.length) {
    return notApprovedUsers.value.filter((user: any) => {
      return level.value ? user.level === level.value : true;
    });
  }
  return [];
});

// const filteredInvalidList = computed(() => {
//     if (usersList.value.length) {
//     return usersList.value.filter((user: any) => {
//       return level.value ? user.level === level.value : true;
//     });
//   }
//   return [];
// })

const filteredTotalList = computed(() => {
  if (usersList.value.length) {
    return usersList.value.filter((user: any) => {
      return level.value ? user.level === level.value : true;
    });
  }
  return [];
});

const computedTitle = computed(() => {
  const titleMap = {
    registered: "Total Users",
    approved: "Approved Voters",
    rejected: "Rejected Voters",
    invalid: "Invalid Voters",
  };

  return titleMap[route.query.type];
});

</script>
