<script setup lang="ts">
import type { ConversionResult } from '~/types'
import { zip } from 'fflate'
import { useAlterError } from '~/composables/useAlterError'
import { downloadSingleFile } from '~/utils'

const { conversionResults } = defineProps<{
  conversionResults: ConversionResult[]
}>()

const emits = defineEmits<{
  (e: 'resetState'): void
}>()

const { setError } = useAlterError()

const buttons = [
  { id: 'windows', label: '下载 Windows 图标 (.ico)', icon: 'i-simple-icons-windows11' },
  { id: 'macos', label: '下载 macOS 图标 (.icns)', icon: 'i-simple-icons-apple' },
  { id: 'linux', label: '下载 Linux 图标 (.zip)', icon: 'i-simple-icons-linux' },
]

const selectedPlatforms = computed(() => {
  return conversionResults.map(item => item.platform)
})

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
        setError('ZIP文件创建失败，请重试。')
        return
      }

      const zipBlob = new Blob([data], { type: 'application/zip' })
      const filename = `${Date.now()}-icons-all-platforms.zip`

      downloadSingleFile(zipBlob, filename)
    })
  }
  catch (error) {
    console.error('下载失败:', error)
    setError('下载失败，请重试。')
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
  <div class="flex flex-1 flex-col py-8">
    <div class="flex flex-1 flex-col items-center justify-center">
      <div
        class="
          flex h-20 w-20 items-center justify-center rounded-full bg-green-100
          dark:bg-green-900/50
        "
      >
        <UIcon
          name="i-heroicons-check-badge" class="
            h-12 w-12 text-green-500
            dark:text-green-400
          "
        />
      </div>
      <h2
        class="
          mt-6 text-3xl font-bold text-gray-900
          dark:text-white
        "
      >
        转换完成！
      </h2>
      <p
        class="
          mt-2 mb-6 text-sm text-gray-500
          dark:text-gray-400
        "
      >
        您的图标已准备就绪，可以下载了。
      </p>

      <div class="w-full max-w-md space-y-3">
        <template v-for="button in buttons" :key="button.id">
          <UButton
            v-if="selectedPlatforms.includes(button.id)"
            :label="button.label"
            :icon="button.icon"
            size="lg"
            block
            variant="outline"
            @click="() => handleDownload(button.id)"
          />
        </template>
        <UButton
          v-if="selectedPlatforms.length > 1" label="下载所有平台图标 (.zip)" size="xl" block class="
            mt-4
          "
          icon="i-heroicons-archive-box-arrow-down" @click="() => handleDownload('all')"
        />
      </div>

      <div class="mt-8 w-full max-w-min">
        <div
          class="
            rounded-lg border border-blue-200 bg-blue-50 p-3
            dark:border-blue-800 dark:bg-blue-900/20
          "
        >
          <div class="flex items-start">
            <UIcon
              name="i-heroicons-information-circle"
              class="
                mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-blue-600
                dark:text-blue-400
              "
            />
            <div
              class="
                text-sm whitespace-nowrap text-blue-800
                dark:text-blue-300
              "
            >
              <p>
                所有文件处理均在浏览器中完成，您的图像不会上传到任何服务器。
              </p>
            </div>
          </div>
        </div>
      </div>

      <UButton variant="link" class="mt-6" @click="() => emits('resetState')">
        创建新的图标
      </UButton>
    </div>
  </div>
</template>
