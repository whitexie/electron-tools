<script setup lang="ts">
import { computed, ref } from 'vue'

// 定义组件状态
const step = ref<'upload' | 'configure' | 'download'>('upload')
const sourceFile = ref<File | null>(null)
const sourceImagePreview = ref<string | null>(null)
const selectedPlatforms = ref<string[]>([])
const isConverting = ref(false)
const conversionError = ref<string | null>(null)

// 支持的平台选项
const platforms = [
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
 * 触发图标转换流程
 */
async function startConversion() {
  if (!canConvert.value)
    return

  isConverting.value = true
  conversionError.value = null

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    // 在此添加实际的图标转换逻辑
    step.value = 'download'
  }
  catch (error) {
    conversionError.value = '图标转换失败，请重试。'
    console.error(error)
  }
  finally {
    isConverting.value = false
  }
}

/**
 * 重置所有状态
 */
function resetState() {
  step.value = 'upload'
  sourceFile.value = null
  sourceImagePreview.value = null
  selectedPlatforms.value = []
  conversionError.value = null
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 md:py-16">
    <Transition name="fade" mode="out-in">
      <!-- 步骤 1: 上传 -->
      <div v-if="step === 'upload'" key="upload" class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Electron 图标转换器
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          轻松将您的图片转换为 Windows, macOS, 和 Linux 应用图标。
        </p>
        <div class="max-w-2xl mx-auto mt-10">
          <FileUploadZone @file-uploaded="handleFileUpload" />
        </div>
        <UAlert
          v-if="conversionError"
          icon="i-heroicons-x-circle"
          color="red"
          variant="soft"
          :title="conversionError"
          class="mt-6 max-w-2xl mx-auto"
        />
      </div>

      <!-- 步骤 2: 配置 -->
      <div v-else-if="step === 'configure'" key="configure">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            配置您的图标
          </h2>
          <p class="mt-2 text-md text-gray-500 dark:text-gray-400">
            选择目标平台并开始生成。
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div class="flex flex-col items-center">
            <h3 class="font-semibold text-lg mb-4">
              源图像
            </h3>
            <ImagePreview :src="sourceImagePreview!" :alt="sourceFile?.name || ''" />
            <UButton variant="link" size="sm" class="mt-4" @click="resetState">
              选择其他图片
            </UButton>
          </div>
          <div>
            <h3 class="font-semibold text-lg mb-4">
              选择平台
            </h3>
            <div class="space-y-4">
              <UCard
                v-for="platform in platforms"
                :key="platform.id"
                class="cursor-pointer transition-all duration-200"
                :ui="{
                  body: { padding: 'px-4 py-3 sm:p-4' },
                  ring: selectedPlatforms.includes(platform.id) ? 'ring-2 ring-primary-500 dark:ring-primary-400' : 'ring-1 ring-gray-200 dark:ring-gray-700',
                }"
                @click="() => {
                  const index = selectedPlatforms.indexOf(platform.id)
                  if (index > -1) selectedPlatforms.splice(index, 1)
                  else selectedPlatforms.push(platform.id)
                }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <UIcon :name="platform.icon" class="w-6 h-6" />
                    <div>
                      <p class="font-semibold">
                        {{ platform.name }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ platform.description }}
                      </p>
                    </div>
                  </div>
                  <UCheckbox :model-value="selectedPlatforms.includes(platform.id)" :ui="{ base: 'pointer-events-none' }" />
                </div>
              </UCard>
            </div>
            <UButton
              :loading="isConverting"
              :disabled="!canConvert"
              size="xl"
              block
              class="mt-8"
              @click="startConversion"
            >
              {{ isConverting ? '正在转换...' : '生成图标' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- 步骤 3: 下载 -->
      <div v-else-if="step === 'download'" key="download" class="text-center">
        <div class="w-20 h-20 mx-auto flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full">
          <UIcon name="i-heroicons-check-badge" class="w-12 h-12 text-green-500 dark:text-green-400" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          转换完成！
        </h2>
        <p class="mt-2 text-md text-gray-500 dark:text-gray-400">
          您的图标已准备就绪，可以下载了。
        </p>
        <div class="max-w-md mx-auto mt-8 space-y-4">
          <UButton
            v-if="selectedPlatforms.includes('windows')"
            label="下载 Windows 图标 (.ico)"
            size="lg"
            block
            variant="outline"
            icon="i-simple-icons-windows11"
          />
          <UButton
            v-if="selectedPlatforms.includes('macos')"
            label="下载 macOS 图标 (.icns)"
            size="lg"
            block
            variant="outline"
            icon="i-simple-icons-apple"
          />
          <UButton
            v-if="selectedPlatforms.includes('linux')"
            label="下载 Linux 图标 (.zip)"
            size="lg"
            block
            variant="outline"
            icon="i-simple-icons-linux"
          />
          <UButton
            v-if="selectedPlatforms.length > 1"
            label="下载所有平台图标 (.zip)"
            size="xl"
            block
            class="mt-6"
            icon="i-heroicons-archive-box-arrow-down"
          />
        </div>
        <UButton variant="link" class="mt-12" @click="resetState">
          创建新的图标
        </UButton>
      </div>
    </Transition>
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
