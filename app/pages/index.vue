<script setup lang="ts">
import { useHead } from '#app'
import { ref } from 'vue'
import IconConverterMain from '~/components/IconConverterMain.vue'

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
  <div>
    <!-- 介绍页面 -->
    <div v-if="showIntro">
      <!-- 英雄区域 -->
      <section
        class="
          relative flex-1 overflow-hidden bg-gradient-to-b from-blue-50 to-white
          py-16
          md:py-24
          dark:from-gray-900 dark:to-gray-950
        "
      >
        <!-- 背景装饰 -->
        <div
          class="
            absolute inset-0 overflow-hidden opacity-10
            dark:opacity-5
          "
        >
          <div
            class="
              absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500
            "
          />
          <div
            class="
              absolute top-40 -left-20 h-60 w-60 rounded-full bg-purple-500
            "
          />
          <div
            class="
              absolute right-20 bottom-20 h-40 w-40 rounded-full bg-green-500
            "
          />
        </div>

        <div
          class="
            relative mx-auto flex h-full max-w-7xl flex-col items-center
            justify-center px-4 text-center
            sm:px-6
            lg:px-8
          "
        >
          <h1
            class="
              text-4xl font-extrabold tracking-tight text-gray-900
              md:text-5xl
              lg:text-6xl
              dark:text-white
            "
          >
            <span class="block">Electron 应用图标</span>
            <span
              class="
                block text-blue-600
                dark:text-blue-400
              "
            >一键转换工具</span>
          </h1>
          <p
            class="
              mx-auto mt-6 max-w-2xl text-xl text-gray-600
              dark:text-gray-300
            "
          >
            轻松将您的图片转换为 Windows、macOS 和 Linux 平台所需的应用图标格式
          </p>

          <!-- 核心特性 -->
          <div
            class="
              mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6
              md:grid-cols-3
            "
          >
            <div
              class="
                flex flex-col items-center rounded-xl bg-white/50 p-6
                backdrop-blur-sm
                dark:bg-gray-900/50
              "
            >
              <div
                class="
                  mb-4 flex h-12 w-12 items-center justify-center rounded-lg
                  bg-green-100
                  dark:bg-green-900/30
                "
              >
                <UIcon
                  name="i-heroicons-shield-check" class="
                    h-6 w-6 text-green-600
                    dark:text-green-400
                  "
                />
              </div>
              <h3
                class="
                  font-semibold text-gray-900
                  dark:text-white
                "
              >
                隐私保护
              </h3>
              <p
                class="
                  mt-2 text-center text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                客户端处理，文件不上传
              </p>
            </div>
            <div
              class="
                flex flex-col items-center rounded-xl bg-white/50 p-6
                backdrop-blur-sm
                dark:bg-gray-900/50
              "
            >
              <div
                class="
                  mb-4 flex h-12 w-12 items-center justify-center rounded-lg
                  bg-blue-100
                  dark:bg-blue-900/30
                "
              >
                <UIcon
                  name="i-heroicons-bolt" class="
                    h-6 w-6 text-blue-600
                    dark:text-blue-400
                  "
                />
              </div>
              <h3
                class="
                  font-semibold text-gray-900
                  dark:text-white
                "
              >
                快速转换
              </h3>
              <p
                class="
                  mt-2 text-center text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                秒级生成多平台图标
              </p>
            </div>
            <div
              class="
                flex flex-col items-center rounded-xl bg-white/50 p-6
                backdrop-blur-sm
                dark:bg-gray-900/50
              "
            >
              <div
                class="
                  mb-4 flex h-12 w-12 items-center justify-center rounded-lg
                  bg-purple-100
                  dark:bg-purple-900/30
                "
              >
                <UIcon
                  name="i-heroicons-check-badge" class="
                    h-6 w-6 text-purple-600
                    dark:text-purple-400
                  "
                />
              </div>
              <h3
                class="
                  font-semibold text-gray-900
                  dark:text-white
                "
              >
                标准兼容
              </h3>
              <p
                class="
                  mt-2 text-center text-sm text-gray-600
                  dark:text-gray-400
                "
              >
                符合各平台规范要求
              </p>
            </div>
          </div>

          <!-- 支持的平台 -->
          <div
            class="
              mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8
              md:gap-16
            "
          >
            <div class="flex flex-col items-center">
              <div
                class="
                  flex h-16 w-16 items-center justify-center rounded-xl
                  bg-blue-100 shadow-md
                  md:h-20 md:w-20
                  dark:bg-blue-900/30
                "
              >
                <UIcon
                  name="i-simple-icons-windows11"
                  class="
                    h-10 w-10 text-blue-600
                    md:h-12 md:w-12
                    dark:text-blue-400
                  "
                />
              </div>
              <h3
                class="
                  mt-4 font-semibold text-gray-900
                  dark:text-white
                "
              >
                Windows
              </h3>
              <p
                class="
                  mt-1 text-sm text-gray-500
                  dark:text-gray-400
                "
              >
                .ico 格式
              </p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="
                  flex h-16 w-16 items-center justify-center rounded-xl
                  bg-gray-100 shadow-md
                  md:h-20 md:w-20
                  dark:bg-gray-800/50
                "
              >
                <UIcon
                  name="i-simple-icons-apple" class="
                    h-10 w-10 text-gray-800
                    md:h-12 md:w-12
                    dark:text-gray-200
                  "
                />
              </div>
              <h3
                class="
                  mt-4 font-semibold text-gray-900
                  dark:text-white
                "
              >
                macOS
              </h3>
              <p
                class="
                  mt-1 text-sm text-gray-500
                  dark:text-gray-400
                "
              >
                .icns 格式
              </p>
            </div>
            <div class="flex flex-col items-center">
              <div
                class="
                  flex h-16 w-16 items-center justify-center rounded-xl
                  bg-yellow-100 shadow-md
                  md:h-20 md:w-20
                  dark:bg-yellow-900/30
                "
              >
                <UIcon
                  name="i-simple-icons-linux"
                  class="
                    h-10 w-10 text-yellow-600
                    md:h-12 md:w-12
                    dark:text-yellow-400
                  "
                />
              </div>
              <h3
                class="
                  mt-4 font-semibold text-gray-900
                  dark:text-white
                "
              >
                Linux
              </h3>
              <p
                class="
                  mt-1 text-sm text-gray-500
                  dark:text-gray-400
                "
              >
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
              class="
                cursor-pointer gap-1 rounded-full px-12 py-4 text-lg
                font-semibold shadow-lg transition-all duration-200
                hover:shadow-xl
              "
              @click="startConverting"
            >
              开始转换图标
            </UButton>
          </div>

          <!-- 快速说明 -->
          <div class="mx-auto mt-12 max-w-2xl">
            <div
              class="
                rounded-xl bg-white/70 p-6 backdrop-blur-sm
                dark:bg-gray-900/70
              "
            >
              <h3
                class="
                  mb-4 text-lg font-semibold text-gray-900
                  dark:text-white
                "
              >
                使用步骤
              </h3>
              <div
                class="
                  grid grid-cols-1 gap-4 text-sm
                  md:grid-cols-3
                "
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="
                      flex h-8 w-8 items-center justify-center rounded-full
                      bg-blue-100 font-bold text-blue-600
                      dark:bg-blue-900/30 dark:text-blue-400
                    "
                  >
                    1
                  </div>
                  <span
                    class="
                      text-gray-700
                      dark:text-gray-300
                    "
                  >上传图片</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="
                      flex h-8 w-8 items-center justify-center rounded-full
                      bg-purple-100 font-bold text-purple-600
                      dark:bg-purple-900/30 dark:text-purple-400
                    "
                  >
                    2
                  </div>
                  <span
                    class="
                      text-gray-700
                      dark:text-gray-300
                    "
                  >选择平台</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="
                      flex h-8 w-8 items-center justify-center rounded-full
                      bg-green-100 font-bold text-green-600
                      dark:bg-green-900/30 dark:text-green-400
                    "
                  >
                    3
                  </div>
                  <span
                    class="
                      text-gray-700
                      dark:text-gray-300
                    "
                  >下载图标</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 转换器页面 -->
    <div
      v-else class="
        bg-gray-50
        dark:bg-gray-950
      "
    >
      <!-- 顶部导航 -->
      <div
        class="
          sticky top-16 z-40 border-b border-gray-200 bg-white
          dark:border-gray-800 dark:bg-gray-950
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
            <div class="flex items-center space-x-4">
              <UButton icon="i-heroicons-arrow-left" variant="ghost" size="sm" @click="backToIntro">
                返回
              </UButton>
              <div
                class="
                  h-6 w-px bg-gray-300
                  dark:bg-gray-600
                "
              />
              <h2
                class="
                  text-lg font-semibold text-gray-900
                  dark:text-white
                "
              >
                图标转换器
              </h2>
            </div>
            <div
              class="
                text-sm text-gray-500
                dark:text-gray-400
              "
            >
              支持 PNG、JPG、SVG、WebP 格式
            </div>
          </div>
        </div>
      </div>

      <!-- 转换器主体 -->
      <div
        class="
          mx-auto max-w-6xl p-4
          sm:px-6
          lg:px-8
        "
      >
        <div
          class="
            overflow-hidden rounded-xl bg-white shadow-lg
            dark:bg-gray-900
          "
        >
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
