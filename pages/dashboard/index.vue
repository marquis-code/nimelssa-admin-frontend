<template>
  <main class="space-y-10">
    <div class="mt-12">
      <DashboardStats :loading="loading" :usersList="usersList" :approvedMatric="approvedUsers" :rejectedMatric="notApprovedUsers" />
      
     <ElectionCompletionRate />
    </div>
  </main>
</template>
xx
<script setup lang="ts">
import { useFetchAllUsers } from '@/composables/user/getAllUsers'
const { usersList, loading, approvedUsers, notApprovedUsers } = useFetchAllUsers()
definePageMeta({
layout: 'dashboard',
  middleware: ['auth']
})
</script>x