<script setup lang="ts">
import type { PlatformConfig, PlatformId } from '~/types/platform'
import { computed, watch } from 'vue'
import { getEnabledPlatforms, getPlatformConfig } from '~/utils/platform-utils'

interface Props {
  /** 当前选中的平台列表 */
  modelValue: PlatformId[]
  /** 是否显示验证错误 */
  showError?: boolean
}

interface Emits {
  /** 平台选择变化事件 */
  (event: 'update:modelValue', value: PlatformId[]): void
  /** 验证状态变化事件 */
  (event: 'validationChange', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  showError: false,
})

const emit = defineEmits<Emits>()

// 获取可用平台配置
const availablePlatforms = computed(() => getEnabledPlatforms())

// 双向绑定选中的平台
const selectedPlatforms = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// 选中平台的配置信息
const selectedPlatformConfigs = computed(() =>
  selectedPlatforms.value.map(id => getPlatformConfig(id)),
)

// 验证错误显示状态
const showValidationError = computed(() =>
  props.showError && selectedPlatforms.value.length === 0,
)

/**
 * 获取平台图标名称
 */
function getPlatformIcon(platformId: PlatformId): string {
  const iconMap: Record<PlatformId, string> = {
    windows: 'i-simple-icons-windows',
    macos: 'i-simple-icons-apple',
    linux: 'i-simple-icons-linux',
  }
  return iconMap[platformId] || 'i-heroicons-computer-desktop'
}

/**
 * 获取平台描述信息
 */
function getPlatformDescription(platform: PlatformConfig): string {
  const format = platform.formats[0]
  if (!format)
    return ''

  const sizeRange = format.sizes.length > 1
    ? `${Math.min(...format.sizes)}px - ${Math.max(...format.sizes)}px`
    : `${format.sizes[0]}px`

  return `${format.extension.toUpperCase()} 格式, ${sizeRange}`
}

/**
 * 获取格式摘要信息
 */
function getFormatSummary(platform: PlatformConfig): string {
  const format = platform.formats[0]
  if (!format)
    return ''

  const extension = format.extension.toUpperCase()
  const sizeCount = format.sizes.length

  if (sizeCount === 1) {
    return `${extension} 文件 (${format.sizes[0]}px)`
  }
  else {
    return `${extension} 文件 (${sizeCount} 种尺寸)`
  }
}

// 监听选择变化，自动验证
watch(selectedPlatforms, (newValue) => {
  const isValid = newValue.length > 0
  emit('validationChange', isValid)
}, { immediate: true })
</script>

<template>
  <div class="space-y-4">
    <!-- 标题和描述 -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        选择目标平台
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        选择需要生成图标的平台，支持多选
      </p>
    </div>

    <!-- 平台选择器 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="platform in availablePlatforms" :key="platform.id" class="relative">
        <label
          :for="`platform-${platform.id}`"
          class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          :class="[
            selectedPlatforms.includes(platform.id)
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700',
          ]"
        >
          <input
            :id="`platform-${platform.id}`" v-model="selectedPlatforms" type="checkbox" :value="platform.id"
            class="sr-only"
          >

          <!-- 平台图标 -->
          <div class="flex-shrink-0 mr-3">
            <UIcon
              :name="getPlatformIcon(platform.id)" class="w-6 h-6" :class="[
                selectedPlatforms.includes(platform.id)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500',
              ]"
            />
          </div>

          <!-- 平台信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ platform.name }}
              </h4>
              <div v-if="selectedPlatforms.includes(platform.id)" class="flex-shrink-0">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ getPlatformDescription(platform) }}
            </p>
          </div>
        </label>
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="showValidationError"
      class="flex items-center p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
    >
      <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 mr-2 flex-shrink-0" />
      <span>请至少选择一个目标平台</span>
    </div>

    <!-- 选择摘要 -->
    <div
      v-if="selectedPlatforms.length > 0"
      class="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800"
    >
      <div class="flex items-start">
        <Icon
          name="i-heroicons-information-circle"
          class="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0"
        />
        <div class="text-sm text-blue-800 dark:text-blue-300">
          <p class="font-medium mb-1">
            将生成以下格式：
          </p>
          <ul class="space-y-1">
            <li v-for="platform in selectedPlatformConfigs" :key="platform.id">
              <span class="font-medium">{{ platform.name }}:</span>
              {{ getFormatSummary(platform) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
