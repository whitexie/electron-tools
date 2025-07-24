<script setup lang="ts">
import { useColorMode, useHead } from '#imports'

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
    <header
      class="
        sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md
        dark:border-gray-800 dark:bg-gray-950/80
      "
    >
      <div
        class="
          mx-auto max-w-7xl px-4
          sm:px-6
          lg:px-8
        "
      >
        <div class="flex h-16 items-center justify-between">
          <!-- Logo 和标题 -->
          <div class="flex items-center space-x-3">
            <NuxtLink to="/" class="group flex items-center space-x-3">
              <div
                class="
                  flex h-10 w-10 items-center justify-center rounded-lg
                  bg-gradient-to-br from-blue-500 to-purple-600 shadow-md
                  transition-all duration-200
                  group-hover:shadow-lg
                "
              >
                <UIcon name="i-heroicons-photo" class="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  class="
                    text-lg font-bold text-gray-900 transition-colors
                    group-hover:text-blue-600
                    dark:text-white dark:group-hover:text-blue-400
                  "
                >
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
              class="
                flex h-10 w-10 cursor-pointer items-center justify-center
                rounded-full border-gray-300 text-gray-700
                hover:bg-gray-100
                dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
              "
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
            />

            <!-- GitHub 链接 -->
            <UButton
              icon="i-simple-icons-github"
              variant="ghost"
              size="md"
              class="
                flex h-10 w-10 items-center justify-center rounded-full
                border-gray-300 text-gray-700
                hover:bg-gray-100
                dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
              "
              to="https://github.com"
              target="_blank"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="w-full flex-1">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer
      class="
        mt-auto border-t border-gray-200 bg-white
        dark:border-gray-800 dark:bg-gray-950
      "
    >
      <div
        class="
          mx-auto max-w-7xl px-4 py-8
          sm:px-6
          lg:px-8
        "
      >
        <div
          class="
            grid grid-cols-1 gap-8
            md:grid-cols-3
          "
        >
          <!-- 关于项目 -->
          <div>
            <h3
              class="
                text-sm font-semibold tracking-wider text-gray-900 uppercase
                dark:text-white
              "
            >
              关于项目
            </h3>
            <p
              class="
                mt-4 text-sm text-gray-600
                dark:text-gray-400
              "
            >
              Electron 图标转换器是一个开源工具，帮助开发者轻松创建跨平台应用图标。所有处理均在客户端完成，保护您的隐私。
            </p>
          </div>

          <!-- 功能特性 -->
          <div>
            <h3
              class="
                text-sm font-semibold tracking-wider text-gray-900 uppercase
                dark:text-white
              "
            >
              功能特性
            </h3>
            <ul class="mt-4 space-y-3">
              <li
                class="
                  flex items-center space-x-3 text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                <UIcon
                  name="i-heroicons-shield-check" class="
                    h-5 w-5 flex-shrink-0 text-green-500
                  "
                />
                <span>客户端处理，保护隐私</span>
              </li>
              <li
                class="
                  flex items-center space-x-3 text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                <UIcon
                  name="i-heroicons-bolt" class="
                    h-5 w-5 flex-shrink-0 text-yellow-500
                  "
                />
                <span>快速高效的图标转换</span>
              </li>
              <li
                class="
                  flex items-center space-x-3 text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                <UIcon
                  name="i-heroicons-sparkles" class="
                    h-5 w-5 flex-shrink-0 text-purple-500
                  "
                />
                <span>深色/浅色主题切换</span>
              </li>
            </ul>
          </div>

          <!-- 支持的平台 -->
          <div>
            <h3
              class="
                text-sm font-semibold tracking-wider text-gray-900 uppercase
                dark:text-white
              "
            >
              支持的平台
            </h3>
            <ul class="mt-4 space-y-3">
              <li
                class="
                  flex items-center space-x-3 text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                <UIcon
                  name="i-simple-icons-windows11" class="h-5 w-5 flex-shrink-0"
                />
                <span>Windows (.ico)</span>
              </li>
              <li
                class="
                  flex items-center space-x-3 text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                <UIcon name="i-simple-icons-apple" class="h-5 w-5 flex-shrink-0" />
                <span>macOS (.icns)</span>
              </li>
              <li
                class="
                  flex items-center space-x-3 text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                <UIcon name="i-simple-icons-linux" class="h-5 w-5 flex-shrink-0" />
                <span>Linux (.png)</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="
            mt-8 border-t border-gray-200 pt-8
            dark:border-gray-800
          "
        >
          <div
            class="
              flex flex-col items-center justify-center
              md:flex-row
            "
          >
            <!-- 版权信息 -->
            <div
              class="
                text-center text-sm text-gray-600
                dark:text-gray-400
              "
            >
              <p>© 2025 Ysansan. 保留所有权利。</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
