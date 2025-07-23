<script setup lang="ts">
defineProps<{
  selectedPlatforms: string[]
}>()

const emits = defineEmits<{
  (e: 'download', platforms: PlatformId | 'all'): void
  (e: 'resetState'): void
}>()

const buttons = [
  { id: 'windows', label: '下载 Windows 图标 (.ico)', icon: 'i-simple-icons-windows11' },
  { id: 'macos', label: '下载 macOS 图标 (.icns)', icon: 'i-simple-icons-apple' },
  { id: 'linux', label: '下载 Linux 图标 (.zip)', icon: 'i-simple-icons-linux' },
]
</script>

<template>
  <div class="flex-1 flex flex-col py-8">
    <div class="flex flex-col items-center justify-center flex-1">
      <div class="w-20 h-20 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full">
        <UIcon name="i-heroicons-check-badge" class="w-12 h-12 text-green-500 dark:text-green-400" />
      </div>
      <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
        转换完成！
      </h2>
      <p class="mt-2 text-md text-gray-500 dark:text-gray-400 mb-6">
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
            @click="() => emits('download', button.id as PlatformId)"
          />
        </template>
        <UButton
          v-if="selectedPlatforms.length > 1" label="下载所有平台图标 (.zip)" size="xl" block class="mt-4"
          icon="i-heroicons-archive-box-arrow-down" @click="() => emits('download', 'all')"
        />
      </div>

      <div class="mt-8 w-full max-w-min">
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
          <div class="flex items-start">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0"
            />
            <div class="text-sm text-blue-800 dark:text-blue-300">
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
