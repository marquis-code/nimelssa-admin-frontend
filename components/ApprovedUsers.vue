<template>
    <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Matric
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Level
                  </th>
                  <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="user in users" :key="user._id" class="even:bg-gray-50">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
                  >
                    <span>{{ user.firstname }}</span>  <span>{{ user.lastname }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ user.matric }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ user.level }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span v-if="user.isMatricApproved" class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium capitalize text-green-800">Approved</span>
                    <span v-else class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium capitalize text-yellow-800">Pending</span>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
                  >
            <div class="space-x-3">
              <!-- <button @click="approveMatricNumber(user)" class="text-indigo-600 hover:text-indigo-900 border rounded-lg px-4 py-2"
              >Approve</button
            > -->
                <button @click="rejectMatricNumber(user)" class="text-red-600 hover:text-indigo-900 border rounded-lg px-4 py-2"
                  >Reject</button
                >
            </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
</template>


<script setup lang="ts">
// import { useFetchAllUsers } from '@/composables/user/getAllUsers'
import { useApproveMatric } from '@/composables/user/approveMatric'
import { useRejectMatric  } from '@/composables/user/rejectMatric'
// const { usersList, loading, approvedUsers, notApprovedUsers } = useFetchAllUsers()
const { approveMatricNumber, loading: approving } = useApproveMatric()
const { rejectMatricNumber, loading: rejecting } = useRejectMatric()
const route = useRoute()
const router = useRouter
// definePageMeta({
//   layout: 'dashboard'
// })

const props = defineProps({
    users: {
        type: Array
    }
})

// const handleTab = (item: string) => {
// console.log(item, 'item here')
// router.push({
//   path: route.path,
//   query: {
//     ...route.query,
//     type: item
//   }
// })
// }

// const computedTitle = computed(() => {
//  const titleMap = {
//   registered: 'Registered Voters',
//   approved: 'Approved Voters',
//   rejected: 'Rejected Voters',
//   invalid: 'Invalid Voters'
//  }

//  return titleMap[route.query.type]
// })
</script>