<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex items-center">
      <span class="text-sm sm:text-base font-semibold text-gray-900">
        Welcome {{ username }}! 😊
      </span>
    </div>
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Add any additional header actions here (notifications, profile dropdown, etc.) -->
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  username: string;
}>();
</script>