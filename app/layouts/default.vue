<script setup lang="ts">
// 设置页面标题和元数据
useHead({
  title: 'Electron 图标转换器',
  meta: [
    {
      name: 'description',
      content: '将图像转换为多平台的 Electron 应用程序图标 - 支持 Windows (.ico)、macOS (.icns) 和 Linux (.png) 格式',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#3b82f6',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.ico',
    },
  ],
})

// 颜色模式管理
const colorMode = useColorMode()
</script>

<template>
  <div class="flex flex-col">
    <!-- 顶部导航栏 -->
    <header class="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo 和标题 -->
          <div class="flex items-center space-x-3">
            <NuxtLink to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <UIcon name="i-heroicons-photo" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Electron 图标转换器
                </h1>
              </div>
            </NuxtLink>
          </div>

          <!-- 右侧操作区 -->
          <div class="flex items-center space-x-3">
            <!-- 主题切换按钮 -->
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              variant="ghost"
              color="primary"
              size="md"
              class="w-10 h-10 rounded-full cursor-pointer flex justify-center items-center border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
            />

            <!-- GitHub 链接 -->
            <UButton
              icon="i-simple-icons-github"
              variant="ghost"
              size="md"
              class="w-10 h-10 rounded-full flex justify-center items-center border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              to="https://github.com"
              target="_blank"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 关于项目 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              关于项目
            </h3>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Electron 图标转换器是一个开源工具，帮助开发者轻松创建跨平台应用图标。所有处理均在客户端完成，保护您的隐私。
            </p>
          </div>

          <!-- 功能特性 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              功能特性
            </h3>
            <ul class="mt-4 space-y-3">
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>客户端处理，保护隐私</span>
              </li>
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>快速高效的图标转换</span>
              </li>
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>响应式设计，支持移动设备</span>
              </li>
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span>深色/浅色主题切换</span>
              </li>
            </ul>
          </div>

          <!-- 支持的平台 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              支持的平台
            </h3>
            <ul class="mt-4 space-y-3">
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-simple-icons-windows11" class="w-5 h-5 flex-shrink-0" />
                <span>Windows (.ico)</span>
              </li>
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-simple-icons-apple" class="w-5 h-5 flex-shrink-0" />
                <span>macOS (.icns)</span>
              </li>
              <li class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-simple-icons-linux" class="w-5 h-5 flex-shrink-0" />
                <span>Linux (.png)</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div class="flex flex-col md:flex-row justify-center items-center">
            <!-- 版权信息 -->
            <div class="text-sm text-center text-gray-600 dark:text-gray-400">
              <p>© 2025 Ysansan. 保留所有权利。</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
