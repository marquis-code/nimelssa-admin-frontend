<template>
    <main class="">
      <div v-if="defaultView === 'list'">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto pt-10">
            <h1 class="text-xl font-semibold leading-6 text-gray-900">Electoral Candidate</h1>
            <p class="mt-2 text-sm text-gray-700">A list of all your candidates including name, quote, image and price.</p>
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button type="button" @click="showSlideOver = true" class="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Add Candidate</button>
          </div>
        </div>
        <div v-if="!loading && candidates.length" class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Avatar</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Level</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quote</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="candidate in candidates" :key="candidate.id">
                    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div class="flex items-center">
                        <div class="h-11 w-11 flex-shrink-0">
                          <CoreImageZoom v-if="candidate.image" class="h-10 w-10" :src="candidate.image" />
                          <!-- <img class="h-11 w-11 rounded-full" :src="candidate.image" alt=""> -->
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ candidate.name || 'Nil' }}</td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ candidate.level || 'Nil' }}</td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ candidate.position || 'Nil' }}</td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ candidate.quote.slice(0, 30) + '...' || 'Nil' }}</td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {{ moment.utc(candidate.createdAt).format('MMMM Do YYYY') || 'Nil' }}
                    </td>
                    <td class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <div class="flex items-center justify-center gap-x-4">
                        <a @click.prevent="handleEditCandidate(candidate)" href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                        <a @click.prevent="deleteCandidate(candidate._id)" href="#" class="text-red-600 hover:text-red-900">Delete</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="loading" class="h-32 bg-slate-300 rounded w-full mt-6 animate-pulse"></div>
        <div class="text-center border rounded-xl py-6 mt-6" v-else>
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-2 text-sm font-semibold text-gray-900">No candidates available</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new candidate.</p>
        </div>
        
      </div>
  
      <!-- candidate Form (Slide Over) -->
      <CoreSlideOver :show="showSlideOver" @close="closeSlideOver" :showFooter="false">
        <template v-slot:title>
          <h2 class="text-base font-semibold leading-6 text-gray-900" id="slide-over-title">{{ selectedCandidate ? 'Edit Candidate' : 'Create Candidate' }}</h2>
        </template>
        <form @submit.prevent="submitForm" class="space-y-6">
            <div>
                <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Upload candidate Image</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div class="text-center">
                    <img v-if="form.image || form.imageUrl" :src="form.image ? form.image : form.imageUrl" alt="Image preview" class="mt-4 mx-auto h-24 w-24 rounded-md object-cover" />
                    <svg v-else class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                    </svg>
                    <div class="mt-4 flex text-sm leading-6 text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="onFileChange">
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
          <div>
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Enter candidate Name</label>
            <div class="relative mt-2 rounded-md shadow-sm">
              <input type="text" id="name" v-model="form.name" :class="inputClass('name')" class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" placeholder="candidate Name">
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
            </div>
          </div>
          <div>
            <label for="position" class="block text-sm font-medium leading-6 text-gray-900">Select candidate position</label>
            <div class="relative mt-2 rounded-md shadow-sm">
              <select id="position" v-model="form.position" :class="inputClass('position')" class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                <option value="" disabled>Select electoral position</option>
                <option v-for="position in positionsList" :key="position.code" :value="position.code">{{ position.name }}</option>
              </select>
              <p v-if="errors.position" class="mt-2 text-sm text-red-600">{{ errors.position }}</p>
            </div>
          </div>
          <div>
            <label for="level" class="block text-sm font-medium leading-6 text-gray-900">Select candidate level</label>
            <div class="relative mt-2 rounded-md shadow-sm">
              <select id="level" v-model="form.level" :class="inputClass('level')" class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                <option value="" disabled>Select academic level</option>
                <option v-for="level in levelList" :key="level.code" :value="level.code">{{ level.name }}</option>
              </select>
              <p v-if="errors.category" class="mt-2 text-sm text-red-600">{{ errors.category }}</p>
            </div>
          </div>
          <div>
            <label for="quote" class="block text-sm font-medium leading-6 text-gray-900">Enter candidate Quote</label>
            <div class="relative mt-2 rounded-md shadow-sm">
              <textarea id="quote" v-model="form.quote" :class="inputClass('quote')" rows="4" class="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" placeholder="candidate quote"></textarea>
              <p v-if="errors.quote" class="mt-2 text-sm text-red-600">{{ errors.quote }}</p>
            </div>
          </div>
          <div class="w-full">
            <button :disabled="creatingCandidates || updating" type="submit" class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 w-full bg-indigo-600 px-3.5 py-2.5 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <span v-if="creatingCandidates || updating" class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l2.829-2.829a4 4 0 000-5.656L6 4.707l-1.414 1.414 2.829 2.829a2 2 0 010 2.828L4.586 17.707 6 19.121z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>
                {{ selectedCandidate ? 'Update' : 'Submit' }}
              </span>
            </button>
          </div>
        </form>
      </CoreSlideOver>
    </main>
  </template>
  
  <script setup lang="ts">
  import moment from 'moment';
  import { useGetAllCandidates } from '@/composables/candidates/fetch';
  import { useCreateCandidate } from '@/composables/candidates/create';
  import { useUpdateCandidate } from '@/composables/candidates/update';
  import { useDeleteCandidate } from '@/composables/candidates/delete';
  
  const { candidates, loading, getAllCandidates } = useGetAllCandidates();
  const { createCandidate, resetForm, form, loading: creatingCandidates, errors, selectedCandidate, showDropdown, levelList, positionsList } = useCreateCandidate();
  const {  updateCandidate, setEditCandidate, loading: updating } = useUpdateCandidate();
  const { deleteCandidate, loading: deleting } = useDeleteCandidate()
  
  const defaultView = ref('list');
  const showSlideOver = ref(false);
  
  const closeSlideOver = () => {
    showSlideOver.value = false;
    resetForm();
    selectedCandidate.value = null;
  };
  
  const submitForm = async () => {
    if (selectedCandidate.value) {
        setEditCandidate(form.value);
      await updateCandidate().then(() => {
        showSlideOver.value = false;
        getAllCandidates(); // Refresh the candidates list
      });
    } else {
      await createCandidate().then(() => {
        showSlideOver.value = false;
        getAllCandidates(); // Refresh the candidates list
      });
    }
  };
  
  const inputClass = (field: string) => {
    return errors[field] ? 'border-red-500' : 'border-gray-300';
  };
  
  const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      form.value.file = target.files[0];
      form.value.image = URL.createObjectURL(target.files[0]);
      reader.onload = (e: any) => {
        form.value.imageUrl = e.target.result as string;
      };
      reader.readAsDataURL(target.files[0]);
    }
  };
  
  const handleEditCandidate = (candidate: any) => {
    showSlideOver.value = true;
    selectedCandidate.value = { ...candidate };
    form.value = { ...candidate };
  };
  </script>