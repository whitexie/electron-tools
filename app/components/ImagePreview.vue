<script setup lang="ts">
defineProps<{ src: string, alt: string }>()
</script>

<template>
  <div
    class="
      relative mx-auto aspect-square w-full max-w-sm overflow-hidden
      bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_75%),linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_75%)]
      bg-[length:20px_20px]
      bg-position-[0_0,10px_10px] shadow-sm ring-1 ring-gray-200
      dark:ring-gray-700
    "
  >
    <img :src="src" :alt="alt" class="h-full w-full object-contain p-4">
  </div>
</template>
