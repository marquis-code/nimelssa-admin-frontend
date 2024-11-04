<!-- components/CenterModal.vue -->
<template>
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeModal"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
          >
            &times;
          </button>
          <slot></slot>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });
  
  const emits = defineEmits(['close']);
  
  function closeModal() {
    emits('close');
  }
  </script>
  
  <style scoped>
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter, .modal-fade-leave-to {
    opacity: 0;
  }
  </style>
  