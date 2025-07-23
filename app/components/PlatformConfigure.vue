<script lang="ts" setup>
import type { Platform } from '~/types'

defineProps<{
  isConverting: boolean
  canConvert: boolean
  sourceImagePreview: string | null
  sourceFile: File | null
  platforms: Platform[]
}>()

const emits = defineEmits<{
  (e: 'resetState'): void
  (e: 'startConversion'): void
}>()

const selectedPlatforms = defineModel<string[]>({ required: true })
</script>

<template>
  <div class="flex-1 flex flex-col py-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        配置您的图标
      </h2>
      <p class="mt-2 text-md text-gray-500 dark:text-gray-400">
        选择目标平台并开始生成。
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-4 flex-1">
      <div class="flex flex-col items-center">
        <h3 class="font-semibold text-lg mb-4">
          源图像
        </h3>
        <ImagePreview :src="sourceImagePreview!" :alt="sourceFile?.name || ''" />
        <UButton variant="link" size="sm" class="mt-4" @click="() => emits('resetState')">
          选择其他图片
        </UButton>
      </div>
      <div>
        <h3 class="font-semibold text-lg mb-4">
          选择平台
        </h3>
        <div class="space-y-3">
          <UCard
            v-for="platform in platforms" :key="platform.id" class="cursor-pointer transition-all duration-200"
            :ui="{ body: 'px-4 py-3 sm:p-4' }" @click="() => {
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
              <UCheckbox
                :model-value="selectedPlatforms.includes(platform.id)"
                :ui="{ base: 'pointer-events-none' }"
              />
            </div>
          </UCard>
        </div>
        <UButton
          :loading="isConverting"
          :disabled="!canConvert"
          size="xl"
          block
          class="mt-6"
          @click="() => emits('startConversion')"
        >
          {{ isConverting ? '正在转换...' : '生成图标' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
