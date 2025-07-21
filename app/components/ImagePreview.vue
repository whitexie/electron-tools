<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  /** 要预览的文件 */
  file: File | null
  /** 是否显示详细信息 */
  showDetails?: boolean
  /** 预览图像的最大宽度 */
  maxWidth?: number
  /** 预览图像的最大高度 */
  maxHeight?: number
}

interface Emits {
  /** 图像加载成功事件 */
  (e: 'load', dimensions: { width: number, height: number }): void
  /** 图像加载失败事件 */
  (e: 'error', error: string): void
  /** 移除图像事件 */
  (e: 'remove'): void
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true,
  maxWidth: 300,
  maxHeight: 300,
})

const emit = defineEmits<Emits>()

// 响应式状态
const imageUrl = ref<string>('')
const isLoading = ref(false)
const error = ref<string>('')
const imageDimensions = ref<{ width: number, height: number } | null>(null)
const imageElement = ref<HTMLImageElement>()

// 计算属性
const fileSize = computed(() => {
  if (!props.file)
    return ''

  const bytes = props.file.size
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
})

const fileName = computed(() => props.file?.name || '')

const fileType = computed(() => {
  if (!props.file)
    return ''
  return props.file.type.split('/')[1]?.toUpperCase() || ''
})

const dimensionsText = computed(() => {
  if (!imageDimensions.value)
    return ''
  return `${imageDimensions.value.width} × ${imageDimensions.value.height}`
})

/**
 * 加载图像预览
 */
async function loadImagePreview() {
  if (!props.file) {
    clearPreview()
    return
  }

  try {
    isLoading.value = true
    error.value = ''

    // 创建图像URL
    const url = URL.createObjectURL(props.file)
    imageUrl.value = url

    // 等待图像加载完成以获取尺寸
    await loadImageDimensions(url)
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : '图像加载失败'
    error.value = errorMessage
    emit('error', errorMessage)
  }
  finally {
    isLoading.value = false
  }
}

/**
 * 加载图像尺寸信息
 */
function loadImageDimensions(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      imageDimensions.value = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      }
      emit('load', imageDimensions.value)
      resolve()
    }

    img.onerror = () => {
      reject(new Error('无法加载图像文件'))
    }

    img.src = url
  })
}

/**
 * 清除预览
 */
function clearPreview() {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = ''
  }
  imageDimensions.value = null
  error.value = ''
}

/**
 * 处理移除图像
 */
function handleRemove() {
  clearPreview()
  emit('remove')
}

/**
 * 处理图像加载错误
 */
function handleImageError() {
  const errorMessage = '图像预览加载失败'
  error.value = errorMessage
  emit('error', errorMessage)
}

// 监听文件变化
watch(() => props.file, loadImagePreview, { immediate: true })

// 组件卸载时清理资源
onMounted(() => {
  onUnmounted(() => {
    clearPreview()
  })
})
</script>

<template>
  <div v-if="file" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- 预览区域 -->
    <div class="relative">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-primary-500" />
          <span class="text-sm text-gray-600 dark:text-gray-400">加载图像中...</span>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="p-4">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="soft"
          :title="error"
        />
      </div>

      <!-- 图像预览 -->
      <div v-else-if="imageUrl" class="relative">
        <div class="flex justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <img
            ref="imageElement"
            :src="imageUrl"
            :alt="fileName"
            :style="{
              maxWidth: `${maxWidth}px`,
              maxHeight: `${maxHeight}px`,
            }"
            class="max-w-full h-auto rounded shadow-sm"
            @error="handleImageError"
          >
        </div>

        <!-- 移除按钮 -->
        <button
          type="button"
          class="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click="handleRemove"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- 文件信息 -->
    <div v-if="showDetails && !isLoading && !error" class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="space-y-2">
        <!-- 文件名 -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">文件名</span>
          <span class="text-sm text-gray-900 dark:text-gray-100 truncate max-w-48" :title="fileName">
            {{ fileName }}
          </span>
        </div>

        <!-- 文件大小 -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">大小</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ fileSize }}</span>
        </div>

        <!-- 文件类型 -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">格式</span>
          <UBadge :label="fileType" variant="soft" />
        </div>

        <!-- 图像尺寸 -->
        <div v-if="imageDimensions" class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">尺寸</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ dimensionsText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
