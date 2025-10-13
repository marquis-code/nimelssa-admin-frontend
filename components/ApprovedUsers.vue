<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section with Download Button -->
      <div class="mb-6 mt-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">Approved Users</h1>
          <p class="mt-1 text-sm text-gray-500">List of all approved students</p>
        </div>
        <button
          @click="downloadPDF"
          :disabled="downloading"
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

      <!-- Table Container -->
      <div id="pdf-content" class="bg-white rounded-lg shadow-sm border border-gray-50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Matric
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Level
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in users"
                :key="user._id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.firstname }} {{ user.lastname }}
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-600 font-mono">{{ user.matric }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-600">{{ user.level }} Level</div>
                </td>
                <td class="px-4 py-3">
                  <span
                    v-if="user.isMatricApproved"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Approved
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                  >
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Pending
                  </span>
                </td>
                <td class="px-4 py-3 print:hidden">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="handleViewUser(user)"
                      class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                      title="View User"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      v-if="user.isMatricApproved"
                      @click="rejectMatricNumber(user)"
                      :disabled="rejecting"
                      class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reject User"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <button
                      v-else
                      @click="approveMatricNumber(user)"
                      :disabled="approving"
                      class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Approve User"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="!users || users.length === 0" class="text-center py-12">
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
            <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p class="mt-1 text-sm text-gray-500">No approved users to display.</p>
          </div>
        </div>
      </div>

      <!-- Total Count -->
      <div v-if="users && users.length > 0" class="mt-4 text-sm text-gray-500">
        Showing {{ users.length }} {{ users.length === 1 ? 'user' : 'users' }}
      </div>
    </div>

    <!-- View User Modal -->
    <CenterModal :isOpen="showViewModal" @close="closeViewModal">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">User Details</h2>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div v-if="viewingUser" class="space-y-3">
          <div class="bg-gray-50 rounded-lg p-3">
            <label class="text-xs font-medium text-gray-500 uppercase">Full Name</label>
            <p class="mt-1 text-sm font-medium text-gray-900">
              {{ viewingUser.firstname }} {{ viewingUser.lastname }}
            </p>
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
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Approved
              </span>
              <span
                v-else
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
              >
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
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
        </div>
      </div>
    </CenterModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApproveMatric } from '@/composables/user/approveMatric'
import { useRejectMatric } from '@/composables/user/rejectMatric'

const { approveMatricNumber, loading: approving } = useApproveMatric()
const { rejectMatricNumber, loading: rejecting } = useRejectMatric()

const props = defineProps({
  users: {
    type: Array,
  },
})

const downloading = ref(false)
const showViewModal = ref(false)
const viewingUser = ref(null)

// View user functionality
const handleViewUser = (user: any) => {
  viewingUser.value = { ...user }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingUser.value = null
}

// PDF Download functionality
const downloadPDF = async () => {
  downloading.value = true

  try {
    // Dynamic import of html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default

    const element = document.getElementById('pdf-content')
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `approved-users-${new Date().toISOString().split('T')[0]}.pdf`,
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

    // Generate PDF
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
/* Print styles for better PDF output */
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
}
</style>