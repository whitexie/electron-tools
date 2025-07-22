<script setup lang="ts">
defineProps<{ src: string, alt: string }>()
</script>

<template>
  <div class="relative w-full max-w-sm mx-auto aspect-square bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm">
    <img :src="src" :alt="alt" class="w-full h-full object-contain p-4">
  </div>
</template>
