<script setup lang="ts">
defineProps<{ src: string, alt: string }>()
</script>

<template>
  <div class="relative w-full max-w-sm mx-auto aspect-square prewview rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm">
    <img :src="src" :alt="alt" class="w-full h-full object-contain p-4">
  </div>
</template>

<style>
.prewview {
  --dark-color: rgba(0, 0, 0, 0.1);
  --rect-size: 20px;
  background-image:
  	linear-gradient(45deg, var(--dark-color) 25%, transparent 25%, transparent 75%, var(--dark-color) 75%),
  	linear-gradient(45deg, var(--dark-color) 25%, transparent 25%, transparent 75%, var(--dark-color) 75%);
  background-position: 0 0, calc( var(--rect-size) / 2 ) calc( var(--rect-size) / 2 );
  background-size: var(--rect-size) var(--rect-size);
}
</style>
