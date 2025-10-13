<template>
  <main class="">
    <div class="space-y-6">
      <DashboardStats :candidates="candidates" :loadingCandidates="loadingCandidates" :loading="loading" :usersList="usersList" :approvedMatric="approvedUsers" :rejectedMatric="notApprovedUsers" />
      
     <ElectionCompletionRate />
    </div>
  </main>
</template>
<script setup lang="ts">
import { useFetchAllUsers } from '@/composables/user/getAllUsers'
import { useGetAllCandidates } from '@/composables/candidates/fetch';
const { usersList, loading, approvedUsers, notApprovedUsers } = useFetchAllUsers()
const { candidates, loading: loadingCandidates } = useGetAllCandidates();
definePageMeta({
layout: 'dashboard',
  middleware: ['auth']
})
</script>x