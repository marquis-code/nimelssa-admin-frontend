<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'relative w-full cursor-pointer rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition-all duration-200',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500'
          : isOpen
          ? 'border-green-500 ring-2 ring-green-500'
          : 'border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500'
      ]"
    >
      <span class="flex items-center justify-between">
        <span :class="modelValue ? 'text-gray-900' : 'text-gray-400'">
          {{ selectedLabel || placeholder }}
        </span>
        <svg
          :class="[
            'h-5 w-5 transition-transform duration-200',
            isOpen ? 'rotate-180 text-green-600' : 'text-gray-400'
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
        v-if="isOpen"
        class="absolute z-10 mt-2 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <ul class="max-h-60 overflow-auto rounded-lg py-1 text-sm">
          <li
            v-for="option in options"
            :key="option.code"
            @click="selectOption(option)"
            :class="[
              'cursor-pointer px-3 py-2.5 transition-colors duration-150',
              modelValue === option.code
                ? 'bg-green-50 text-green-900 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-between">
              <span>{{ option.name }}</span>
              <svg
                v-if="modelValue === option.code"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  name: string
  code: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const selected = props.options.find(option => option.code === props.modelValue)
  return selected?.name || ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.code)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>