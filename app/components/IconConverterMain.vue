<script setup lang="ts">
import type { Platform } from '~/types'
import { computed, ref } from 'vue'
import ConverterResultPrewview from '~/components/ConverterResultPrewview.vue'
import FileUploadZone from '~/components/FileUploadZone.vue'

import { useConverter } from '~/composables/useConverter'
import PlatformConfigure from './PlatformConfigure.vue'

// 定义组件状态
const step = ref<'upload' | 'configure' | 'download'>('upload')
const sourceFile = ref<File | null>(null)
const sourceImagePreview = ref<string | null>(null)
const {
  isConverting,
  // pngFiles,
  selectedPlatforms,
  conversionResults,
  startConversion,
} = useConverter()

const { error, setError } = useAlterError()

// 支持的平台选项
const platforms: Platform[] = [
  { id: 'windows', name: 'Windows', description: '.ico format', icon: 'i-simple-icons-windows11' },
  { id: 'macos', name: 'macOS', description: '.icns format', icon: 'i-simple-icons-apple' },
  { id: 'linux', name: 'Linux', description: '.png set', icon: 'i-simple-icons-linux' },
]

// 计算属性
const canConvert = computed(() => selectedPlatforms.value.length > 0 && !isConverting.value)

/**
 * 处理文件上传
 */
function handleFileUpload(file: File) {
  const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
  if (!validTypes.includes(file.type)) {
    setError('文件格式不支持。请上传 PNG, JPG, SVG, 或 WebP 格式的图片。')
    step.value = 'upload'
    return
  }

  sourceFile.value = file
  sourceImagePreview.value = URL.createObjectURL(file)
  setError(null)
  step.value = 'configure'
}

/**
 * 重置所有状态
 */
function resetState() {
  step.value = 'upload'
  sourceFile.value = null
  sourceImagePreview.value = null
  selectedPlatforms.value = []
  conversionResults.splice(0, conversionResults.length)
  setError(null)
}
</script>

<template>
  <div>
    <Transition name="fade" mode="out-in">
      <!-- 步骤 1: 上传 -->
      <div
        v-if="step === 'upload'" key="upload" class="
          flex flex-1 flex-col justify-center py-8 text-center
        "
      >
        <p
          class="
            mt-4 text-lg text-gray-600
            dark:text-gray-400
          "
        >
          轻松将您的图片转换为 Windows, macOS, 和 Linux 应用图标。
        </p>
        <p
          class="
            mt-4 text-lg text-gray-600
            dark:text-gray-400
          "
        >
          建议使用1024x1024尺寸的图片。
        </p>
        <div class="mx-auto mt-10 max-w-2xl">
          <FileUploadZone accept="image/png,image/jpeg,image/svg+xml,image/webp" @file-uploaded="handleFileUpload" />
        </div>
      </div>

      <!-- 步骤 2: 配置 -->
      <template v-else-if="step === 'configure'">
        <PlatformConfigure
          v-model="selectedPlatforms"
          :is-converting
          :can-convert
          :source-image-preview
          :source-file
          :platforms
          @reset-state="resetState"
          @start-conversion="async () => {
            if (sourceFile) {
              await startConversion(sourceFile)
              step = 'download'
            }
          }"
        />
      </template>

      <!-- 步骤 3: 下载 -->
      <ConverterResultPrewview
        v-else-if="step === 'download'"
        key="download"
        :selected-platforms
        :conversion-results
        @reset-state="resetState"
      />
    </transition>
    <UAlert
      v-if="error"
      :title="error"
      icon="i-heroicons-x-circle"
      color="error"
      variant="soft"
      close
      class="mx-auto mb-6 max-w-2xl"
      @update:open="setError(null)"
    />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
