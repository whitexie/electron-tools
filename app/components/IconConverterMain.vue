<script setup lang="ts">
import type { ConversionResult, Platform } from '~/types'
import { zip } from 'fflate'
import { computed, ref } from 'vue'
import ConverterResultPrewview from '~/components/ConverterResultPrewview.vue'
import FileUploadZone from '~/components/FileUploadZone.vue'

import { useConverter } from '~/composables/useConverter'
import { downloadSingleFile } from '~/utils/file-utils'
import PlatformConfigure from './PlatformConfigure.vue'

// 定义组件状态
const step = ref<'upload' | 'configure' | 'download'>('upload')
const sourceFile = ref<File | null>(null)
const sourceImagePreview = ref<string | null>(null)
const conversionError = ref<string | null>(null)

const {
  isConverting,
  // pngFiles,
  selectedPlatforms,
  conversionResults,
  startConversion,
} = useConverter()

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
    conversionError.value = '文件格式不支持。请上传 PNG, JPG, SVG, 或 WebP 格式的图片。'
    step.value = 'upload'
    return
  }

  sourceFile.value = file
  sourceImagePreview.value = URL.createObjectURL(file)
  conversionError.value = null
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
  conversionError.value = null
}

/**
 * 下载所有转换结果
 * 如果只有一个平台，直接下载该平台的文件
 * 如果有多个平台，创建ZIP包下载
 */
async function downloadPlatformFile(results: ConversionResult[]) {
  if (results.length === 0) {
    return
  }

  try {
    // 如果只有一个平台且只有一个文件，直接下载
    if (results.length === 1 && results[0]?.files.length === 1) {
      const result = results[0]
      const file = result.files[0]
      if (result && file) {
        downloadSingleFile(file.blob, file.name)
        return
      }
    }

    // 准备ZIP文件数据
    const zipFiles: Record<string, Uint8Array> = {}

    // 为每个平台的文件添加到ZIP中
    for (const result of results) {
      if (!result.success)
        continue

      for (const file of result.files) {
        // 将文件放在平台文件夹下
        const filePath = `${result.platform}/${file.name}`
        // 将Blob转换为Uint8Array
        const arrayBuffer = await file.blob.arrayBuffer()
        zipFiles[filePath] = new Uint8Array(arrayBuffer)
      }
    }

    // 使用fflate创建ZIP
    zip(zipFiles, (err, data) => {
      if (err) {
        console.error('ZIP创建失败:', err)
        conversionError.value = 'ZIP文件创建失败，请重试。'
        return
      }

      const zipBlob = new Blob([data], { type: 'application/zip' })
      const filename = `${sourceFile.value?.name?.split('.')[0] || 'icons'}-all-platforms.zip`

      downloadSingleFile(zipBlob, filename)
    })
  }
  catch (error) {
    console.error('下载失败:', error)
    conversionError.value = '下载失败，请重试。'
  }
}

function handleDownload(platform: string) {
  if (platform === 'all') {
    downloadPlatformFile(conversionResults)
    return
  }

  const result = conversionResults.find(result => result.platform === platform)
  if (result) {
    downloadPlatformFile([result])
  }
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <!-- 步骤 1: 上传 -->
    <div
      v-if="step === 'upload'" key="upload" class="
        flex flex-1 flex-col justify-center py-8 text-center
      "
    >
      <!-- <h1
        class="
          text-4xl font-bold tracking-tight text-gray-900
          md:text-5xl
          dark:text-white
        "
      >
        Electron 图标转换器
      </h1> -->
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
      <UAlert
        v-if="conversionError" icon="i-heroicons-x-circle" color="error" variant="soft" :title="conversionError"
        class="mx-auto mt-6 max-w-2xl"
      />
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
      @download="handleDownload"
      @reset-state="resetState"
    />
  </transition>
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
