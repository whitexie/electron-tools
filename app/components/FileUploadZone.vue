<script setup lang="ts">
import type { ValidationResult } from '~/types'
import { computed, onUnmounted, ref } from 'vue'
import { validateFileComplete } from '~/utils/file-utils'

interface Props {
  /** 是否禁用上传 */
  disabled?: boolean
  /** 自定义验证选项 */
  validationOptions?: Record<string, unknown>
}

interface Emits {
  /** 文件上传成功事件 */
  (e: 'upload', file: File): void
  /** 验证失败事件 */
  (e: 'error', error: string): void
  /** 验证开始事件 */
  (e: 'validating', isValidating: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  validationOptions: () => ({}),
})

const emit = defineEmits<Emits>()

// 响应式状态
const isDragOver = ref(false)
const isValidating = ref(false)
const error = ref<string>('')
const fileInput = ref<HTMLInputElement>()

// 计算属性
const isDisabled = computed(() => props.disabled || isValidating.value)

// 拖拽计数器，用于处理嵌套元素的拖拽事件
let dragCounter = 0

/**
 * 处理点击事件
 */
function handleClick() {
  if (isDisabled.value)
    return
  fileInput.value?.click()
}

/**
 * 处理拖拽进入
 */
function handleDragOver(event: DragEvent) {
  if (isDisabled.value)
    return

  event.preventDefault()
  dragCounter++

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }

  isDragOver.value = true
}

/**
 * 处理拖拽离开
 */
function handleDragLeave(event: DragEvent) {
  if (isDisabled.value)
    return

  event.preventDefault()
  dragCounter--

  if (dragCounter === 0) {
    isDragOver.value = false
  }
}

/**
 * 处理文件拖放
 */
function handleDrop(event: DragEvent) {
  if (isDisabled.value)
    return

  event.preventDefault()
  dragCounter = 0
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      handleFile(file)
    }
  }
}

/**
 * 处理文件选择
 */
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      handleFile(file)
    }
  }

  // 清空input值，允许重复选择同一文件
  target.value = ''
}

/**
 * 处理文件验证和上传
 */
async function handleFile(file: File) {
  clearError()

  try {
    isValidating.value = true
    emit('validating', true)

    // 执行文件验证
    const validation: ValidationResult = await validateFileComplete(file, props.validationOptions)

    if (validation.valid) {
      // 验证通过，触发上传事件
      emit('upload', file)
    }
    else {
      // 验证失败，显示错误
      error.value = validation.error || '文件验证失败'
      emit('error', error.value)
    }
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : '文件处理时发生未知错误'
    error.value = errorMessage
    emit('error', errorMessage)
  }
  finally {
    isValidating.value = false
    emit('validating', false)
  }
}

/**
 * 清除错误信息
 */
function clearError() {
  error.value = ''
}

// 组件卸载时重置拖拽状态
onUnmounted(() => {
  dragCounter = 0
  isDragOver.value = false
})
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out" :class="[
      isDragOver
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]" @click="handleClick" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" class="hidden"
      :disabled="isDisabled" @change="handleFileSelect"
    >

    <div class="flex flex-col items-center justify-center p-8 text-center">
      <!-- 上传图标 -->
      <div class="mb-4">
        <UIcon
          :name="isDragOver ? 'i-heroicons-arrow-down-tray' : 'i-heroicons-cloud-arrow-up'"
          class="w-12 h-12 text-gray-400 dark:text-gray-500" :class="{ 'animate-bounce': isDragOver }"
        />
      </div>

      <!-- 主要文本 -->
      <div class="mb-2">
        <p class="text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ isDragOver ? '释放文件以上传' : '拖拽图像文件到此处' }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          或者 <span class="text-primary-600 dark:text-primary-400 font-medium">点击选择文件</span>
        </p>
      </div>

      <!-- 支持格式说明 -->
      <div class="text-xs text-gray-400 dark:text-gray-500">
        <p>支持格式：PNG、JPG、JPEG、SVG、WebP</p>
        <p>最大文件大小：10MB</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="isValidating" class="mt-4">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          <span class="text-sm text-gray-600 dark:text-gray-400">验证文件中...</span>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="absolute inset-x-0 bottom-0 p-4">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft" :title="error"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
        @close="clearError"
      />
    </div>
  </div>
</template>
