<template>
  <section class="min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-2xl font-bold mb-6">Election Results</h1>
    <ElectionChart :electionData="electionResultsList.winners" />
  </section>
</template>

<script setup lang="ts">
import { useFetchResults } from '@/composables/result/fetch'
const { electionResultsList, loading } = useFetchResults();
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});
</script>

<style scoped>
</style>
