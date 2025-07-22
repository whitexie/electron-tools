<script setup lang="ts">
// 页面特定的元数据
useHead({
  title: 'Electron 图标转换器 - 一键生成多平台应用图标',
})

// 控制页面显示状态
const showIntro = ref(true)

// 切换到转换器
function startConverting() {
  showIntro.value = false
  window.scrollTo(0, 0)
}

// 返回介绍页面
function backToIntro() {
  showIntro.value = true
}
</script>

<template>
  <div class="min-h-screen">
    <!-- 介绍页面 -->
    <div v-if="showIntro" class="min-h-screen flex flex-col">
      <!-- 英雄区域 -->
      <section
        class="flex-1 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 md:py-24"
      >
        <!-- 背景装饰 -->
        <div class="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full" />
          <div class="absolute top-40 -left-20 w-60 h-60 bg-purple-500 rounded-full" />
          <div class="absolute bottom-20 right-20 w-40 h-40 bg-green-500 rounded-full" />
        </div>

        <div
          class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center h-full justify-center"
        >
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            <span class="block">Electron 应用图标</span>
            <span class="block text-blue-600 dark:text-blue-400">一键转换工具</span>
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            轻松将您的图片转换为 Windows、macOS 和 Linux 平台所需的应用图标格式
          </p>

          <!-- 核心特性 -->
          <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="flex flex-col items-center p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                隐私保护
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                客户端处理，文件不上传
              </p>
            </div>
            <div class="flex flex-col items-center p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                快速转换
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                秒级生成多平台图标
              </p>
            </div>
            <div class="flex flex-col items-center p-6 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm">
              <div
                class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4"
              >
                <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                标准兼容
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                符合各平台规范要求
              </p>
            </div>
          </div>

          <!-- 支持的平台 -->
          <div class="mt-16 grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto">
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-md"
              >
                <UIcon
                  name="i-simple-icons-windows11"
                  class="w-10 h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">
                Windows
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                .ico 格式
              </p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-xl shadow-md"
              >
                <UIcon name="i-simple-icons-apple" class="w-10 h-10 md:w-12 md:h-12 text-gray-800 dark:text-gray-200" />
              </div>
              <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">
                macOS
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                .icns 格式
              </p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-xl shadow-md"
              >
                <UIcon
                  name="i-simple-icons-linux"
                  class="w-10 h-10 md:w-12 md:h-12 text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">
                Linux
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                .png 集合
              </p>
            </div>
          </div>

          <!-- 开始按钮 -->
          <div class="mt-16">
            <UButton
              size="xl"
              icon="i-heroicons-arrow-right"
              variant="solid"
              color="primary"
              class="rounded-full cursor-pointer gap-1 px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              @click="startConverting"
            >
              开始转换图标
            </UButton>
          </div>

          <!-- 快速说明 -->
          <div class="mt-12 max-w-2xl mx-auto">
            <div class="bg-white/70 dark:bg-gray-900/70 rounded-xl p-6 backdrop-blur-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                使用步骤
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold"
                  >
                    1
                  </div>
                  <span class="text-gray-700 dark:text-gray-300">上传图片</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold"
                  >
                    2
                  </div>
                  <span class="text-gray-700 dark:text-gray-300">选择平台</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold"
                  >
                    3
                  </div>
                  <span class="text-gray-700 dark:text-gray-300">下载图标</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 转换器页面 -->
    <div v-else class="bg-gray-50 dark:bg-gray-950">
      <!-- 顶部导航 -->
      <div class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-4">
              <UButton icon="i-heroicons-arrow-left" variant="ghost" size="sm" @click="backToIntro">
                返回
              </UButton>
              <div class="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                图标转换器
              </h2>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              支持 PNG、JPG、SVG、WebP 格式
            </div>
          </div>
        </div>
      </div>

      <!-- 转换器主体 -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <IconConverterMain />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 渐变动画 */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}
</style>
