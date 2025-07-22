<script setup lang="ts">
import type { ConversionProgress } from '~/types'

interface Props {
  /** 转换进度对象 */
  progress: ConversionProgress
  /** 错误消息 */
  errorMessage?: string
  /** 错误标题 */
  errorTitle?: string
  /** 是否显示成功提示 */
  showSuccess?: boolean
}

interface Emits {
  /** 清除错误事件 */
  (e: 'clearError'): void
  /** 隐藏成功提示事件 */
  (e: 'hideSuccess'): void
}

withDefaults(defineProps<Props>(), {
  errorMessage: '',
  errorTitle: '转换错误',
  showSuccess: true,
})

const emit = defineEmits<Emits>()

/**
 * 清除错误消息
 */
function clearError() {
  emit('clearError')
}

/**
 * 隐藏成功提示
 */
function hideSuccess() {
  emit('hideSuccess')
}
</script>

<template>
  <div v-if="progress.isProcessing || progress.progress > 0" class="w-full space-y-4">
    <!-- 进度标题 -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        转换进度
      </h3>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ progress.completedPlatforms }}/{{ progress.totalPlatforms }} 平台完成
      </div>
    </div>

    <!-- 进度条 -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-700 dark:text-gray-300">{{ progress.currentStep }}</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ Math.round(progress.progress) }}%</span>
      </div>

      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          class="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress.progress}%` }"
        />
      </div>
    </div>

    <!-- 状态指示器 -->
    <div class="flex items-center space-x-2">
      <!-- 处理中状态 -->
      <div v-if="progress.isProcessing" class="flex items-center space-x-2">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-4 h-4 text-primary-600 animate-spin"
        />
        <span class="text-sm text-gray-600 dark:text-gray-400">正在处理...</span>
      </div>

      <!-- 完成状态 -->
      <div v-else-if="progress.progress === 100" class="flex items-center space-x-2">
        <UIcon
          name="i-heroicons-check-circle"
          class="w-4 h-4 text-green-600"
        />
        <span class="text-sm text-green-600 dark:text-green-400">转换完成</span>
      </div>
    </div>

    <!-- 错误状态显示 -->
    <UAlert
      v-if="errorMessage"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      :title="errorTitle"
      :description="errorMessage"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
      @close="clearError"
    />

    <!-- 成功状态显示 -->
    <UAlert
      v-if="showSuccess && progress.progress === 100 && !progress.isProcessing"
      icon="i-heroicons-check-circle"
      color="success"
      variant="soft"
      title="转换成功"
      description="所有图标文件已成功生成，可以开始下载。"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
      @close="hideSuccess"
    />
  </div>
</template>
