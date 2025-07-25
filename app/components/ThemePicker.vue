<script lang="ts" setup>
// 颜色模式管理
const colorMode = useColorMode()

// 获取当前主题图标
function getThemeIcon() {
  if (colorMode.preference === 'system') {
    return 'i-heroicons-computer-desktop'
  }
  return colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'
}

// 获取当前主题标签
function getThemeLabel() {
  switch (colorMode.preference) {
    case 'system':
      return '跟随系统'
    case 'light':
      return '亮色模式'
    case 'dark':
      return '暗色模式'
    default:
      return '跟随系统'
  }
}
</script>

<template>
  <UDropdownMenu
    :items="[
      [
        {
          label: '跟随系统',
          icon: 'i-heroicons-computer-desktop',
          checked: colorMode.preference === 'system',
          onSelect: () => { colorMode.preference = 'system' },
        },
      ],
      [
        {
          label: '亮色模式',
          icon: 'i-heroicons-sun',
          checked: colorMode.preference === 'light',
          onSelect: () => { colorMode.preference = 'light' },
        },
        {
          label: '暗色模式',
          icon: 'i-heroicons-moon',
          checked: colorMode.preference === 'dark',
          onSelect: () => { colorMode.preference = 'dark' },
        },
      ],
    ]"
  >
    <UButton
      :icon="getThemeIcon()"
      variant="ghost"
      color="primary"
      size="md"
      class="
        flex h-10 w-10 cursor-pointer items-center justify-center rounded-full
        border-gray-300 text-gray-700
        hover:bg-gray-100
        dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
      "
      :aria-label="`当前主题: ${getThemeLabel()}`"
    />
  </UDropdownMenu>
</template>

<style scoped>
</style>
