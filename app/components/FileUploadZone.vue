<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

defineProps<{
  accept: string
}>()

const emit = defineEmits(['fileUploaded'])
const isDragging = ref(false)
const fileInputRef = useTemplateRef('file-input')

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    emit('fileUploaded', files[0])
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    emit('fileUploaded', files[0])
  }
}

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed rounded-xl transition-colors duration-300"
    :class="isDragging ? 'border-primary-500 dark:border-primary-400' : 'border-gray-200 dark:border-gray-700'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <div class="text-center space-y-2 cursor-pointer">
      <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
      <p class="text-lg font-medium text-gray-800 dark:text-gray-200">
        点击或拖拽文件到此区域
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        支持 PNG, JPG, SVG, 或 WebP 格式
      </p>
    </div>
    <input
      ref="file-input"
      type="file" :accept
      class="hidden" @change="handleFileInput"
    >
  </div>
</template>
