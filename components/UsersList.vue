<template>
  <main>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <div class="relative">
              <div
                v-if="selectedPeople.length > 0"
                class="absolute left-14 top-0 rounded-lg flex h-12 items-center space-x-3 bg-white sm:left-12"
              >
                <button @click="handleBatchApproval"
                  type="button"
                  class="inline-flex items-center rounded-lg text-white bg-green-600 px-2 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Batch approve matric
                </button>
                <button @click="handleBatchDisApproval"
                type="button"
                class="inline-flex items-center text-white rounded-lg  px-2 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  disabled:cursor-not-allowed bg-red-800 disabled:opacity-30"
              >
                Batch Dis-approve matric
              </button>

              <button @click="openModal"
                type="button"
                class="inline-flex items-center text-white rounded-lg  px-2 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  disabled:cursor-not-allowed bg-red-800 disabled:opacity-30"
              >
                Batch Update Level
              </button>

              <button @click="handleBatchDelete"
                type="button"
                class="inline-flex items-center text-white rounded-lg  px-2 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  disabled:cursor-not-allowed bg-red-800 disabled:opacity-30"
              >
                Batch Delete Users
              </button>
              </div>
              <table class="min-w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        :checked="
                          indeterminate ||
                          selectedPeople.length === props.users.length
                        "
                        :indeterminate="indeterminate"
                        @change="
                          selectedPeople = $event.target.checked
                            ? props.users.map((p) => p.matric)
                            : []
                        "
                      />
                    </th>
                    <th
                      scope="col"
                      class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
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
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr
                    v-for="person in users"
                    :key="person.matric"
                    :class="[
                      selectedPeople.includes(person.matric) && 'bg-gray-50',
                    ]"
                  >
                    <td class="relative px-7 sm:w-12 sm:px-6">
                      <div
                        v-if="selectedPeople.includes(person.matric)"
                        class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                      ></div>
                      <input
                        type="checkbox"
                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        :value="person.matric"
                        v-model="selectedPeople"
                      />
                    </td>
                    <td
                      :class="[
                        'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                        selectedPeople.includes(person.matric)
                          ? 'text-indigo-600'
                          : 'text-gray-900',
                      ]"
                    >
                      <span>{{ person.firstname }}</span>
                      <span>{{ person.lastname }}</span>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ person.matric }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ person.level }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      <span
                        v-if="person.isMatricApproved"
                        class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium capitalize text-green-800"
                        >Approved</span
                      >
                      <span
                        v-else
                        class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium capitalize text-yellow-800"
                        >Pending</span
                      >
                    </td>
                    <td
                      class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
                    >
                      <div class="space-x-3">
                        <button
                        @click.prevent="handleEditUser(person)"
                          class="text-gray-700 hover:text-indigo-900 border rounded-lg px-4 py-2"
                        >
                          Edit
                        </button>
                        <!-- <button
                        @click.prevent="deleteUser(person._id)"
                          class="text-gray-700 hover:text-indigo-900 border rounded-lg px-4 py-2"
                        >
                          Delete
                        </button> -->
                        <button
                          v-if="!person.isMatricApproved"
                          @click="approveMatricNumber(person)"
                          class="text-indigo-600 hover:text-indigo-900 border rounded-lg px-4 py-2"
                        >
                          Approve
                        </button>
                        <button
                          v-if="person.isMatricApproved"
                          @click="rejectMatricNumber(person)"
                          class="text-red-600 hover:text-indigo-900 border rounded-lg px-4 py-2"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CoreSlideOver
      :show="showSlideOver"
      @close="closeSlideOver"
      :showFooter="false"
    >
      <template v-slot:title>
        <h2
          class="text-base font-semibold leading-6 text-gray-900"
          id="slide-over-title"
        >
          {{ selectedUser ? "Edit User" : "Create User" }}
        </h2>
      </template>
      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label
            for="firstname"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Enter First Name</label
          >
          <div class="relative mt-2 rounded-md shadow-sm">
            <input
              type="text"
              id="firstname"
              v-model="form.firstname"
              :class="inputClass('firstame')"
              class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="First Name"
            />
            <p v-if="errors.firstname" class="mt-2 text-sm text-red-600">
              {{ errors.firstname }}
            </p>
          </div>
        </div>
        <div>
          <label
            for="lastName"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Enter Last Name</label
          >
          <div class="relative mt-2 rounded-md shadow-sm">
            <input
              type="text"
              id="lastname"
              v-model="form.lastname"
              :class="inputClass('lastname')"
              class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="Last name"
            />
            <p v-if="errors.lastname" class="mt-2 text-sm text-red-600">
              {{ errors.lastname }}
            </p>
          </div>
        </div>
        <div>
          <label
            for="matric"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Select Level</label
          >
          <div class="relative mt-2 rounded-md shadow-sm">
            <select
              id="matric"
              v-model="form.level"
              :class="inputClass('level')"
              class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            >
              <option value="" disabled>Select Level</option>
              <option
                v-for="level in levelList"
                :key="level.code"
                :value="level.code"
              >
                {{ level.name }}
              </option>
            </select>
            <p v-if="errors.position" class="mt-2 text-sm text-red-600">
              {{ errors.position }}
            </p>
          </div>
        </div>
        <div>
          <label
            for="matric"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Matric</label
          >
          <div class="relative mt-2 rounded-md shadow-sm">
            <input
              type="tel"
              id="matric"
              v-model="form.matric"
              :class="inputClass('matric')"
              class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="Matric number"
            />
            <p v-if="errors.firstName" class="mt-2 text-sm text-red-600">
              {{ errors.firstName }}
            </p>
          </div>
        </div>
        <div class="w-full">
          <button
            :disabled="updating"
            type="submit"
            class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 w-full bg-indigo-600 px-3.5 py-2.5 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span
              v-if="updating"
              class="flex items-center justify-center"
            >
              <svg
                class="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l2.829-2.829a4 4 0 000-5.656L6 4.707l-1.414 1.414 2.829 2.829a2 2 0 010 2.828L4.586 17.707 6 19.121z"
                ></path>
              </svg>
              Processing...
            </span>
            <span v-else>
              {{ selectedUser ? "Update" : "Submit" }}
            </span>
          </button>
        </div>
      </form>
    </CoreSlideOver>

    <CenterModal :isOpen="isOpen" @close="closeModal">
 <div class="space-y-6">
  <h2 class="text-sm font-semibold mb-4">Batch Update Academic Level</h2>
     <div class="space-y-2">
      <label class="text-sm">Academic Level</label>
      <select class="w-full py-3 text-sm bg-gray-100 rounded-lg outline-none border-[0.5px] border-gray-100" v-model="updatePayload.level">
        <option value="100">100 Level</option>
        <option value="200">200 Level</option>
        <option value="300">300 Level</option>
        <option value="400">400 Level</option>
        <option value="500">500 Level</option>
      </select>
     </div>

      <div class="flex justify-between gap-x-4 itemsl-center text-sm pt-10">
        <button class="bg-gray-500 text-white py-2.5 w-full rounded-md"  @click="closeModal" >Cancel</button>
        <button class="bg-black disabled:cursor-not-allowed disabled:opacity-25 text-white py-3 w-full rounded-md" @click="proceedToUpdtate">{{updatingUsers ? 'processing' : 'Continue'}}</button>
      </div>
 </div>
    </CenterModal>

    <!-- <CoreModal :show="openModal">
      <label>Academic Level</label>
      <select class="w-full py-3 bg-gray-100 rounded-lg outline-none border-[0.5px] border-gray-100" v-model="updatePayload.level">
        <option value="100">100 Level</option>
        <option value="200">200 Level</option>
        <option value="300">300 Level</option>
        <option value="400">400 Level</option>
        <option value="500">500 Level</option>
      </select>

      <div class="flex justify-between gap-x-4 itemsl-center">
        <button class="bg-black text-white py-3 w-full rounded-md" @click="openModal = false">Cancel</button>
        <button :disabled="!updatePayload.level || updatingUsers" class="bg-black disabled:cursor-not-allowed disabled:opacity-25 text-white py-3 w-full rounded-md" @click="proceedToUpdtate">{{updatingUsers ? 'processing' : 'Continue'}}</button>
      </div>
    </CoreModal> -->
  </main>
</template>

<script lang="ts" setup>
import { useDeleteUsers } from "@/composables/user/batchDeleteUsers";
import { useBatchUpdateMatric } from "@/composables/user/batchUpdateMatric";
  import { useFetchAllUsers } from '@/composables/user/getAllUsers'
import { useBatchApproveMatric } from '@/composables/candidates/batchApprove'
import { useBatchDisApproveMatric } from '@/composables/candidates/batchDisApprove'
import { useUpdateUser } from '@/composables/user/editUser';
import { useDeleteUser } from '@/composables/user/deleteUser';
import { useApproveMatric } from "@/composables/user/approveMatric";
import { useRejectMatric } from "@/composables/user/rejectMatric";
import { useModal } from '@/composables/useModal';
const { isOpen, openModal, closeModal } = useModal();
const { approveMatricNumber, loading: approving } = useApproveMatric();
const { rejectMatricNumber, loading: rejecting } = useRejectMatric();
const { editUser, setEditUser, form, loading: updating, selectedUser, errors, resetForm } = useUpdateUser();
const { deleteUser, loading: deleting } = useDeleteUser()
const { batchApproveMatric, matricList: approvalMatricList, loading: batchApproving, setMatricNumbers: setApprovalMatric } = useBatchApproveMatric()
const { batchDisApproveMatric, matricList: disapprovalMatricList, loading: batchDisApproving, setMatricNumbers: setDisApprovalMatric } = useBatchDisApproveMatric()
const { deleteUsers, loading: deletingUsers } = useDeleteUsers();
const { updateMatricNumbers, loading: updatingUsers } = useBatchUpdateMatric();
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
const { fetchUsers } = useFetchAllUsers()
const route = useRoute();
const router = useRouter;
const selectedPeople = ref([]);

const handleBatchApproval = () => {
  setApprovalMatric(selectedPeople.value)
  batchApproveMatric().then(async () => {
    await fetchUsers()
  }).catch(() => {
     batchApproving.value = false
  }).finally(() => {
    batchApproving.value = false
  })
}

// const openModal = ref(true)

const handleBatchDisApproval = () => {
  setDisApprovalMatric(selectedPeople.value)
  batchDisApproveMatric().then(async () => {
    await fetchUsers()
  }).catch(() => {
    batchDisApproving.value = false
  }).finally(() => {
      batchDisApproving.value = false
  })
}

const handleBatchDelete = async () => {
  const payload = {
    matricNumbers: selectedPeople.value
  }

  if(selectedPeople.value.length > 0){
    await deleteUsers(payload);
  } else {
    showToast({
            title: "Error",
            message: "No users selecetd. please select users.",
            toastType: "error",
            duration: 3000
          });
  }
};

const updatePayload = ref({
    matricNumbers: selectedPeople.value,
    level: "",
  })

// const handleBatchUpdate = async () => {
//   // openModal.value = true
//   if(selectedPeople.value.length > 0){
//     // openModal.value = true
//   } else {
//     showToast({
//             title: "Error",
//             message: "No users selecetd. please select users.",
//             toastType: "error",
//             duration: 3000
//           });
//   }
// };

const proceedToUpdtate = async () => {
  // openModal.value = false
  if(selectedPeople.value.length > 0){
    console.log(selectedPeople.value, 'selecetd')
    const payload = {
      matricNumbers: selectedPeople.value,
      level: updatePayload.value.level,
    }
    await updateMatricNumbers(payload);
    // openModal.value = true
    closeModal()
  } else {
    showToast({
            title: "Error",
            message: "No users selecetd. please select users.",
            toastType: "error",
            duration: 3000
          });
  }
}

const showSlideOver = ref(false);

const levelList = ref([
  {
    name: '200 Level',
    code: '200'
  },
  {
    name: '300 Level',
    code: '300'
  },
  {
    name: '400 Level',
    code: '400'
  },
  {
    name: '500 Level',
    code: '500'
  }
])

  
const closeSlideOver = () => {
    showSlideOver.value = false;
    resetForm();
    selectedUser.value = null;
  };

  const inputClass = (field: any) => {
    return errors[field] ? 'border-red-500' : 'border-gray-300';
  };

    
const handleEditUser = (user: any) => {
  showSlideOver.value = true;
  selectedUser.value = { ...user };
  form.value = { ...user };
};

const props = defineProps({
  users: {
    type: Array,
  },
});

const indeterminate = computed(
  () =>
    selectedPeople.value.length > 0 &&
    selectedPeople.value.length < props.users.length
);

const submitForm = async () => {
    if (selectedUser.value) {
        setEditUser(form.value);
      await editUser().then(async (res) => {
        console.log(res, 'tes here')
        showSlideOver.value = false;
        await fetchUsers(); // Refresh the candidates list
      });
    } 
  };
</script>
