<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

defineProps<{
  accept: string
}>()

const emit = defineEmits(['fileUploaded'])
const toast = useToast()
const isDragging = ref(false)
const fileInputRef = useTemplateRef('file-input')

async function validateImageIsSquare(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      if (img.width !== img.height) {
        resolve(false)
      }
      resolve(true)
    }

    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

async function validateImageAndEmit(file: File) {
  const isSquare = await validateImageIsSquare(file)

  if (isSquare) {
    emit('fileUploaded', file)
  }
  else {
    toast.add({
      title: '请上传正方形的图片',
      description: '推荐使用1024x1024尺寸的图片',
      color: 'error',
    })

    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0 && files[0]) {
    const file = files[0]
    validateImageAndEmit(file)
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0 && files[0]) {
    validateImageAndEmit(files[0])
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
    class="
      group relative flex cursor-pointer flex-col items-center justify-center
      rounded-2xl border-2 border-dashed bg-gradient-to-br from-gray-50
      to-gray-100 p-8 transition-all duration-300
      hover:scale-[1.02] hover:shadow-lg
      sm:p-12
      dark:from-gray-800/50 dark:to-gray-900/50
    "
    :class="[
      isDragging
        ? `
          scale-[1.02] border-primary-500 bg-primary-50 shadow-xl
          dark:border-primary-400 dark:bg-primary-900/20
        `
        : `
          border-gray-300
          hover:border-primary-400
          dark:border-gray-600 dark:hover:border-primary-500
        `,
    ]"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <!-- 背景装饰 -->
    <div
      class="
        absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5
        to-blue-500/5 opacity-0 transition-opacity duration-300
        group-hover:opacity-100
      "
    />

    <!-- 主要内容 -->
    <div class="relative space-y-4 text-center">
      <!-- 图标容器 -->
      <div class="relative">
        <div
          class="
            mx-auto flex h-16 w-16 items-center justify-center rounded-full
            bg-gradient-to-br from-primary-100 to-primary-200 transition-all
            duration-300
            group-hover:scale-110
            dark:from-primary-800 dark:to-primary-900
          "
          :class="isDragging ? 'scale-110 shadow-lg' : ''"
        >
          <UIcon
            name="i-heroicons-cloud-arrow-up"
            class="
              h-8 w-8 text-primary-600 transition-transform duration-300
              dark:text-primary-400
            "
            :class="isDragging ? 'scale-110' : 'group-hover:scale-105'"
          />
        </div>

        <!-- 动画圆环 -->
        <div
          class="
            absolute inset-0 mx-auto h-16 w-16 animate-ping rounded-full
            border-2 border-primary-300 opacity-0
            dark:border-primary-600
          "
          :class="isDragging ? 'opacity-30' : ''"
        />
      </div>

      <!-- 文字内容 -->
      <div class="space-y-2">
        <p
          class="
            text-lg font-semibold text-gray-800 transition-colors duration-300
            dark:text-gray-200
          "
        >
          <span
            v-if="isDragging" class="
              text-primary-600
              dark:text-primary-400
            "
          >
            松开以上传文件
          </span>
          <span v-else>
            点击或拖拽文件到此区域
          </span>
        </p>
        <p
          class="
            text-sm text-gray-500
            dark:text-gray-400
          "
        >
          支持 <span
            class="
              font-medium text-primary-600
              dark:text-primary-400
            "
          >PNG</span>、
          <span
            class="
              font-medium text-primary-600
              dark:text-primary-400
            "
          >JPG</span>、
          <span
            class="
              font-medium text-primary-600
              dark:text-primary-400
            "
          >SVG</span> 或
          <span
            class="
              font-medium text-primary-600
              dark:text-primary-400
            "
          >WebP</span> 格式
        </p>
      </div>

      <!-- 上传按钮 -->
      <div class="pt-2">
        <UButton
          variant="outline" size="sm" class="
            transition-all duration-300
            group-hover:shadow-md
          "
          :class="isDragging ? 'scale-105' : ''"
        >
          <UIcon name="i-heroicons-folder-open" class="mr-2 h-4 w-4" />
          选择文件
        </UButton>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input ref="file-input" type="file" :accept class="hidden" @change="handleFileInput">

    <!-- 拖拽覆盖层 -->
    <div
      v-if="isDragging"
      class="
        absolute inset-0 flex items-center justify-center rounded-2xl
        bg-primary-500/10 backdrop-blur-sm
        dark:bg-primary-400/10
      "
    >
      <div class="text-center">
        <UIcon
          name="i-heroicons-arrow-down-tray"
          class="
            h-12 w-12 animate-bounce text-primary-600
            dark:text-primary-400
          "
        />
        <p
          class="
            mt-2 text-lg font-semibold text-primary-700
            dark:text-primary-300
          "
        >
          释放文件
        </p>
      </div>
    </div>
  </div>
</template>
