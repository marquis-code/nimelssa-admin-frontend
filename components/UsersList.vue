<template>
  <main class="min-h-screen">
    <div class="container mx-auto py-6">
      <!-- Header Section with Download Button -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">User Management</h1>
          <p class="mt-1 text-xs text-gray-500">Manage and approve student matriculation numbers</p>
        </div>
        <button
          @click="downloadPDF"
          :disabled="downloading || !filteredUsers || filteredUsers.length === 0"
          class="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="!downloading"
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <svg
            v-else
            class="animate-spin h-5 w-5 mr-2"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ downloading ? 'Generating PDF...' : 'Download as PDF' }}
        </button>
      </div>

      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or matric number..."
            class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200"
          />
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              @click="clearSearch"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="searchQuery && filteredUsers" class="mt-2 text-sm text-gray-600">
          Found {{ filteredUsers.length }} {{ filteredUsers.length === 1 ? 'user' : 'users' }} matching "{{ searchQuery }}"
        </div>
      </div>

      <!-- Action Bar -->
      <div
        v-if="selectedPeople.length > 0"
        class="mb-4 bg-white rounded-lg shadow-sm border-[0.5px] border-gray-50 p-4"
      >
        <div class="flex items-center justify-between flex-wrap gap-3">
          <span class="text-sm font-medium text-gray-700">
            {{ selectedPeople.length }} {{ selectedPeople.length === 1 ? 'user' : 'users' }} selected
          </span>
          <div class="flex flex-wrap gap-2">
            <button
              @click="handleBatchApproval"
              type="button"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              @click="handleBatchDisApproval"
              type="button"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Disapprove
            </button>
            <button
              @click="openModal"
              type="button"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update Level
            </button>
            <button
              @click="handleBatchDelete"
              type="button"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div id="pdf-content" class="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y-[0.5px] divide-gray-50">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="w-12 px-4 py-4 print:hidden">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    :checked="indeterminate || selectedPeople.length === filteredUsers.length"
                    :indeterminate="indeterminate"
                    @change="selectedPeople = $event.target.checked ? filteredUsers.map((p) => p.matric) : []"
                  />
                </th>
                <th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Matric
                </th>
                <th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y-[0.5px] divide-gray-50">
              <tr
                v-for="person in filteredUsers"
                :key="person.matric"
                :class="[
                  'hover:bg-gray-50 transition-colors duration-150',
                  selectedPeople.includes(person.matric) && 'bg-green-50',
                ]"
              >
                <td class="px-4 py-4 print:hidden">
                  <div class="relative">
                    <div
                      v-if="selectedPeople.includes(person.matric)"
                      class="absolute left-0 inset-y-0 w-1 bg-green-600 rounded-r"
                    ></div>
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      :value="person.matric"
                      v-model="selectedPeople"
                    />
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    <span v-html="highlightMatch(person.firstname + ' ' + person.lastname)"></span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="text-sm text-gray-600 font-mono">
                    <span v-html="highlightMatch(person.matric)"></span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="text-sm text-gray-600">{{ person.level }} Level</div>
                </td>
                <td class="px-4 py-4">
                  <span
                    v-if="person.isMatricApproved"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Approved
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    Pending
                  </span>
                </td>
                <td class="px-4 py-4 print:hidden">
                  <div class="flex justify-end gap-2">
                    <button
                      @click.prevent="handleViewUser(person)"
                      class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      title="View User"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click.prevent="handleEditUser(person)"
                      class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      title="Edit User"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click.prevent="handleDeleteUser(person)"
                      class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      title="Delete User"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="!filteredUsers || filteredUsers.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              {{ searchQuery ? 'No matching users found' : 'No users found' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchQuery ? 'Try adjusting your search terms' : 'No users to display.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Total Count -->
      <div v-if="filteredUsers && filteredUsers.length > 0" class="mt-4 text-sm text-gray-500">
        Showing {{ filteredUsers.length }} {{ filteredUsers.length === 1 ? 'user' : 'users' }}
        <span v-if="searchQuery"> matching your search</span>
      </div>
    </div>

    <!-- View User Modal -->
    <CenterModal :isOpen="showViewModal" @close="closeViewModal">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">User Details</h2>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="viewingUser" class="space-y-3">
          <div class="bg-gray-50 rounded-lg p-3">
            <label class="text-xs font-medium text-gray-500 uppercase">Full Name</label>
            <p class="mt-1 text-sm font-medium text-gray-900">{{ viewingUser.firstname }} {{ viewingUser.lastname }}</p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3">
            <label class="text-xs font-medium text-gray-500 uppercase">Matric Number</label>
            <p class="mt-1 text-sm font-mono font-medium text-gray-900">{{ viewingUser.matric }}</p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3">
            <label class="text-xs font-medium text-gray-500 uppercase">Academic Level</label>
            <p class="mt-1 text-sm font-medium text-gray-900">{{ viewingUser.level }} Level</p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3">
            <label class="text-xs font-medium text-gray-500 uppercase">Status</label>
            <div class="mt-1">
              <span
                v-if="viewingUser.isMatricApproved"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Approved
              </span>
              <span
                v-else
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
              >
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                Pending
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="closeViewModal"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            @click="editFromView"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Edit User
          </button>
        </div>
      </div>
    </CenterModal>

    <!-- Edit User Slide Over -->
    <CoreSlideOver :show="showSlideOver" @close="closeSlideOver" :showFooter="false">
      <template v-slot:title>
        <h2 class="text-lg font-semibold text-gray-900">
          {{ selectedUser ? "Edit User" : "Create User" }}
        </h2>
      </template>
      <form @submit.prevent="submitForm" class="space-y-5">
        <div>
          <label for="firstname" class="block text-sm font-medium text-gray-700 mb-1.5">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            v-model="form.firstname"
            :class="[
              'block w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2',
              errors.firstname
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
            ]"
            placeholder="Enter first name"
          />
          <p v-if="errors.firstname" class="mt-1.5 text-xs text-red-600">
            {{ errors.firstname }}
          </p>
        </div>

        <div>
          <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            v-model="form.lastname"
            :class="[
              'block w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2',
              errors.lastname
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
            ]"
            placeholder="Enter last name"
          />
          <p v-if="errors.lastname" class="mt-1.5 text-xs text-red-600">
            {{ errors.lastname }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Academic Level
          </label>
          <div class="relative" @click.stop>
            <button
              type="button"
              @click="toggleLevelDropdown"
              :class="[
                'relative w-full cursor-pointer rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                errors.level
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : levelDropdownOpen
                  ? 'border-green-500 ring-2 ring-green-500'
                  : 'border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-green-500'
              ]"
            >
              <span class="flex items-center justify-between">
                <span :class="form.level ? 'text-gray-900' : 'text-gray-400'">
                  {{ form.level ? levelList.find(l => l.code === form.level)?.name : 'Select level' }}
                </span>
                <svg
                  :class="[
                    'h-5 w-5 transition-transform duration-200',
                    levelDropdownOpen ? 'rotate-180 text-green-600' : 'text-gray-400'
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="levelDropdownOpen"
                class="absolute z-50 mt-2 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click.stop
              >
                <ul class="max-h-60 overflow-auto rounded-lg py-1 text-sm">
                  <li
                    v-for="option in levelList"
                    :key="option.code"
                    @click="selectLevel(option.code)"
                    :class="[
                      'cursor-pointer px-3 py-2.5 transition-colors duration-150',
                      form.level === option.code
                        ? 'bg-green-50 text-green-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <span>{{ option.name }}</span>
                      <svg
                        v-if="form.level === option.code"
                        class="h-5 w-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
          <p v-if="errors.level" class="mt-1.5 text-xs text-red-600">
            {{ errors.level }}
          </p>
        </div>

        <div>
          <label for="matric" class="block text-sm font-medium text-gray-700 mb-1.5">
            Matric Number
          </label>
          <input
            type="text"
            id="matric"
            v-model="form.matric"
            :class="[
              'block w-full rounded-lg border px-3 py-2.5 text-sm font-mono transition-colors duration-200 focus:outline-none focus:ring-2',
              errors.matric
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
            ]"
            placeholder="Enter matric number"
          />
          <p v-if="errors.matric" class="mt-1.5 text-xs text-red-600">
            {{ errors.matric }}
          </p>
        </div>

        <div class="pt-4">
          <button
            :disabled="updating"
            type="submit"
            class="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="updating" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>
              {{ selectedUser ? "Update User" : "Create User" }}
            </span>
          </button>
        </div>
      </form>
    </CoreSlideOver>

    <!-- Batch Update Modal -->
    <CenterModal :isOpen="isOpen" @close="closeModal">
      <div class="space-y-5">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Batch Update Academic Level</h2>
          <p class="mt-1 text-sm text-gray-500">
            Update the academic level for {{ selectedPeople.length }} selected {{ selectedPeople.length === 1 ? 'user' : 'users' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Select New Level
          </label>
          <div class="relative" @click.stop>
            <button
              type="button"
              @click="toggleBatchDropdown"
              :class="[
                'relative w-full cursor-pointer rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2',
                batchDropdownOpen
                  ? 'border-green-500 ring-2 ring-green-500'
                  : 'border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-green-500'
              ]"
            >
              <span class="flex items-center justify-between">
                <span :class="updatePayload.level ? 'text-gray-900' : 'text-gray-400'">
                  {{ updatePayload.level ? levelList.find(l => l.code === updatePayload.level)?.name : 'Choose academic level' }}
                </span>
                <svg
                  :class="[
                    'h-5 w-5 transition-transform duration-200',
                    batchDropdownOpen ? 'rotate-180 text-green-600' : 'text-gray-400'
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="batchDropdownOpen"
                class="absolute z-50 mt-2 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click.stop
              >
                <ul class="max-h-60 overflow-auto rounded-lg py-1 text-sm">
                  <li
                    v-for="option in levelList"
                    :key="option.code"
                    @click="selectBatchLevel(option.code)"
                    :class="[
                      'cursor-pointer px-3 py-2.5 transition-colors duration-150',
                      updatePayload.level === option.code
                        ? 'bg-green-50 text-green-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <span>{{ option.name }}</span>
                      <svg
                        v-if="updatePayload.level === option.code"
                        class="h-5 w-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="closeModal"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            :disabled="!updatePayload.level || updatingUsers"
            @click="proceedToUpdtate"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="updatingUsers" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
            <span v-else>Update Level</span>
          </button>
        </div>
      </div>
    </CenterModal>

    <!-- Delete Confirmation Modal -->
    <CenterModal :isOpen="showDeleteModal" @close="closeDeleteModal">
      <div class="space-y-4">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900">Delete User</h3>
          <p class="mt-2 text-sm text-gray-500">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div v-if="deletingUser" class="mt-3 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-900">{{ deletingUser.firstname }} {{ deletingUser.lastname }}</p>
            <p class="text-xs text-gray-500 mt-1 font-mono">{{ deletingUser.matric }}</p>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            @click="closeDeleteModal"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            :disabled="deleting"
            @click="confirmDelete"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="deleting" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
            <span v-else>Delete User</span>
          </button>
        </div>
      </div>
    </CenterModal>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
import { useCustomToast } from '@/composables/core/useCustomToast'

const { isOpen, openModal, closeModal } = useModal();
const { approveMatricNumber, loading: approving } = useApproveMatric();
const { rejectMatricNumber, loading: rejecting } = useRejectMatric();
const { editUser, setEditUser, form, loading: updating, selectedUser, errors, resetForm } = useUpdateUser();
const { deleteUser, loading: deleting } = useDeleteUser()
const { batchApproveMatric, matricList: approvalMatricList, loading: batchApproving, setMatricNumbers: setApprovalMatric } = useBatchApproveMatric()
const { batchDisApproveMatric, matricList: disapprovalMatricList, loading: batchDisApproving, setMatricNumbers: setDisApprovalMatric } = useBatchDisApproveMatric()
const { deleteUsers, loading: deletingUsers } = useDeleteUsers();
const { updateMatricNumbers, loading: updatingUsers } = useBatchUpdateMatric();
const { showToast } = useCustomToast();
const { fetchUsers } = useFetchAllUsers()

const selectedPeople = ref([]);
const showSlideOver = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const viewingUser = ref(null);
const deletingUser = ref(null);
const levelDropdownOpen = ref(false);
const batchDropdownOpen = ref(false);
const downloading = ref(false);
const searchQuery = ref('');

const levelList = ref([
  { name: '100 Level', code: '100' },
  { name: '200 Level', code: '200' },
  { name: '300 Level', code: '300' },
  { name: '400 Level', code: '400' },
  { name: '500 Level', code: '500' }
])

const updatePayload = ref({
  matricNumbers: [],
  level: "",
})

const props = defineProps({
  users: {
    type: Array,
  },
});

// Computed property for filtered users based on search query
const filteredUsers = computed(() => {
  if (!props.users) return [];
  
  if (!searchQuery.value.trim()) {
    return props.users;
  }

  const query = searchQuery.value.toLowerCase().trim();
  
  return props.users.filter(user => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const matric = user.matric.toLowerCase();
    
    return fullName.includes(query) || matric.includes(query);
  });
});

const indeterminate = computed(
  () =>
    selectedPeople.value.length > 0 &&
    selectedPeople.value.length < filteredUsers.value.length
);

// Function to clear search
const clearSearch = () => {
  searchQuery.value = '';
};

// Function to highlight matching text
const highlightMatch = (text: string) => {
  if (!searchQuery.value.trim()) {
    return text;
  }

  const query = searchQuery.value.trim();
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-gray-900 font-medium">$1</mark>');
};

// PDF Download functionality
const downloadPDF = async () => {
  downloading.value = true

  try {
    const html2pdf = (await import('html2pdf.js')).default

    const element = document.getElementById('pdf-content')
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `user-management-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('Error generating PDF:', error)
    showToast({
      title: "Error",
      message: "Failed to generate PDF. Please try again.",
      toastType: "error",
      duration: 3000
    });
  } finally {
    downloading.value = false
  }
}

// Dropdown functions
const toggleLevelDropdown = () => {
  levelDropdownOpen.value = !levelDropdownOpen.value;
  batchDropdownOpen.value = false;
}

const toggleBatchDropdown = () => {
  batchDropdownOpen.value = !batchDropdownOpen.value;
  levelDropdownOpen.value = false;
}

const selectLevel = (code: string) => {
  form.value.level = code;
  levelDropdownOpen.value = false;
}

const selectBatchLevel = (code: string) => {
  updatePayload.value.level = code;
  batchDropdownOpen.value = false;
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    levelDropdownOpen.value = false;
    batchDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
})

// View user
const handleViewUser = (user: any) => {
  viewingUser.value = { ...user };
  showViewModal.value = true;
}

const closeViewModal = () => {
  showViewModal.value = false;
  viewingUser.value = null;
}

const editFromView = () => {
  if (viewingUser.value) {
    handleEditUser(viewingUser.value);
    closeViewModal();
  }
}

// Edit user
const handleEditUser = (user: any) => {
  showSlideOver.value = true;
  selectedUser.value = { ...user };
  form.value = { ...user };
};

const closeSlideOver = () => {
  showSlideOver.value = false;
  resetForm();
  selectedUser.value = null;
  levelDropdownOpen.value = false;
};

const submitForm = async () => {
  if (selectedUser.value) {
    setEditUser(form.value);
    await editUser().then(async (res) => {
      showSlideOver.value = false;
      await fetchUsers();
    });
  }
};

// Delete user
const handleDeleteUser = (user: any) => {
  deletingUser.value = { ...user };
  showDeleteModal.value = true;
}

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingUser.value = null;
}

const confirmDelete = async () => {
  if (deletingUser.value) {
    await deleteUser(deletingUser.value._id).then(async () => {
      closeDeleteModal();
      await fetchUsers();
    });
  }
}

// Batch operations
const handleBatchApproval = () => {
  setApprovalMatric(selectedPeople.value)
  batchApproveMatric().then(async () => {
    await fetchUsers()
    selectedPeople.value = []
  }).catch(() => {
    batchApproving.value = false
  }).finally(() => {
    batchApproving.value = false
  })
}

const handleBatchDisApproval = () => {
  setDisApprovalMatric(selectedPeople.value)
  batchDisApproveMatric().then(async () => {
    await fetchUsers()
    selectedPeople.value = []
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

  if (selectedPeople.value.length > 0) {
    await deleteUsers(payload);
    selectedPeople.value = []
  } else {
    showToast({
      title: "Error",
      message: "No users selected. Please select users.",
      toastType: "error",
      duration: 3000
    });
  }
};

const proceedToUpdtate = async () => {
  if (selectedPeople.value.length > 0) {
    const payload = {
      matricNumbers: selectedPeople.value,
      level: updatePayload.value.level,
    }
    await updateMatricNumbers(payload);
    closeModal()
    updatePayload.value.level = "";
    batchDropdownOpen.value = false;
    selectedPeople.value = []
  } else {
    showToast({
      title: "Error",
      message: "No users selected. Please select users.",
      toastType: "error",
      duration: 3000
    });
  }
}
</script>

<style scoped>
input[type="checkbox"]:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  background-color: #16a34a;
  border-color: #16a34a;
}

mark {
  padding: 0.1em 0.2em;
  border-radius: 0.2em;
}

@media print {
  .print\:hidden {
    display: none !important;
  }
  
  body {
    background: white;
  }
  
  table {
    page-break-inside: auto;
  }
  
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  
  thead {
    display: table-header-group;
  }
  
  mark {
    background: transparent;
    color: inherit;
  }
}
</style>