import type { PlatformId } from '~/types/platform'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import PlatformSelector from '../PlatformSelector.vue'

// Mock the platform utils
vi.mock('~/utils/platform-utils', () => ({
  getEnabledPlatforms: () => [
    {
      id: 'windows',
      name: 'Windows',
      formats: [{ extension: 'ico', sizes: [16, 32, 48, 64, 128, 256], mimeType: 'image/x-icon' }],
      enabled: true,
    },
    {
      id: 'macos',
      name: 'macOS',
      formats: [{ extension: 'icns', sizes: [1024], mimeType: 'image/icns' }],
      enabled: true,
    },
    {
      id: 'linux',
      name: 'Linux',
      formats: [{ extension: 'png', sizes: [16, 32, 48, 64, 128, 256, 512], mimeType: 'image/png' }],
      enabled: true,
    },
  ],
  getPlatformConfig: (id: PlatformId) => {
    const configs = {
      windows: {
        id: 'windows',
        name: 'Windows',
        formats: [{ extension: 'ico', sizes: [16, 32, 48, 64, 128, 256], mimeType: 'image/x-icon' }],
        enabled: true,
      },
      macos: {
        id: 'macos',
        name: 'macOS',
        formats: [{ extension: 'icns', sizes: [1024], mimeType: 'image/icns' }],
        enabled: true,
      },
      linux: {
        id: 'linux',
        name: 'Linux',
        formats: [{ extension: 'png', sizes: [16, 32, 48, 64, 128, 256, 512], mimeType: 'image/png' }],
        enabled: true,
      },
    }
    return configs[id]
  },
}))

// Mock Icon component
const MockIcon = {
  name: 'Icon',
  template: '<div class="mock-icon" :data-name="name"></div>',
  props: ['name', 'class'],
}

describe('platformSelector', () => {
  const defaultProps = {
    modelValue: [] as PlatformId[],
  }

  const createWrapper = (props = {}) => {
    return mount(PlatformSelector, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          Icon: MockIcon,
        },
      },
    })
  }

  describe('渲染测试', () => {
    it('应该渲染平台选择器标题和描述', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('h3').text()).toBe('选择目标平台')
      expect(wrapper.find('p').text()).toContain('选择需要生成图标的平台')
    })

    it('应该渲染所有可用平台选项', () => {
      const wrapper = createWrapper()

      const platformLabels = wrapper.findAll('label')
      expect(platformLabels).toHaveLength(3)

      expect(wrapper.text()).toContain('Windows')
      expect(wrapper.text()).toContain('macOS')
      expect(wrapper.text()).toContain('Linux')
    })

    it('应该为每个平台显示正确的描述信息', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('ICO 格式')
      expect(wrapper.text()).toContain('ICNS 格式')
      expect(wrapper.text()).toContain('PNG 格式')
    })
  })

  describe('平台选择功能', () => {
    it('应该支持单个平台选择', async () => {
      const wrapper = createWrapper()

      const windowsCheckbox = wrapper.find('#platform-windows')
      await windowsCheckbox.setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['windows']])
    })

    it('应该支持多个平台选择', async () => {
      const wrapper = createWrapper()

      const windowsCheckbox = wrapper.find('#platform-windows')
      const macosCheckbox = wrapper.find('#platform-macos')

      await windowsCheckbox.setValue(true)
      await macosCheckbox.setValue(true)

      const emittedEvents = wrapper.emitted('update:modelValue')
      expect(emittedEvents).toBeTruthy()

      // 验证至少有选择事件发生
      expect(emittedEvents!.length).toBeGreaterThan(0)

      // 验证最终状态包含选择的平台
      const hasWindows = emittedEvents!.some(event => (event[0] as PlatformId[]).includes('windows'))
      const hasMacos = emittedEvents!.some(event => (event[0] as PlatformId[]).includes('macos'))
      expect(hasWindows).toBe(true)
      expect(hasMacos).toBe(true)
    })

    it('应该支持取消选择平台', async () => {
      const wrapper = createWrapper({
        modelValue: ['windows', 'macos'],
      })

      const windowsCheckbox = wrapper.find('#platform-windows')
      await windowsCheckbox.setValue(false)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['macos']])
    })
  })

  describe('视觉状态测试', () => {
    it('应该为选中的平台显示选中状态样式', () => {
      const wrapper = createWrapper({
        modelValue: ['windows'],
      })

      const windowsLabel = wrapper.find('label[for="platform-windows"]')
      expect(windowsLabel.classes()).toContain('border-primary-500')
      expect(windowsLabel.classes()).toContain('bg-primary-50')
    })

    it('应该为选中的平台显示勾选图标', () => {
      const wrapper = createWrapper({
        modelValue: ['windows'],
      })

      const checkIcon = wrapper.find('[data-name="i-heroicons-check-circle"]')
      expect(checkIcon.exists()).toBe(true)
    })

    it('应该为未选中的平台显示默认样式', () => {
      const wrapper = createWrapper()

      const windowsLabel = wrapper.find('label[for="platform-windows"]')
      expect(windowsLabel.classes()).toContain('border-gray-200')
      expect(windowsLabel.classes()).not.toContain('border-primary-500')
    })
  })

  describe('验证功能测试', () => {
    it('应该在未选择任何平台时显示错误提示', () => {
      const wrapper = createWrapper({
        showError: true,
      })

      const errorMessage = wrapper.find('.text-red-800')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('请至少选择一个目标平台')
    })

    it('应该在选择平台后隐藏错误提示', () => {
      const wrapper = createWrapper({
        modelValue: ['windows'],
        showError: true,
      })

      const errorMessage = wrapper.find('.text-red-800')
      expect(errorMessage.exists()).toBe(false)
    })

    it('应该在组件初始化时触发验证事件', () => {
      const wrapper = createWrapper()

      expect(wrapper.emitted('validationChange')).toBeTruthy()
      // 初始状态应该是false（无选择）
      expect(wrapper.emitted('validationChange')?.[0]).toEqual([false])
    })

    it('应该在选择状态变化时正确更新验证状态', () => {
      // 测试空选择状态
      const emptyWrapper = createWrapper()
      expect(emptyWrapper.emitted('validationChange')?.[0]).toEqual([false])

      // 测试有选择状态
      const selectedWrapper = createWrapper({
        modelValue: ['windows'],
      })
      expect(selectedWrapper.emitted('validationChange')?.[0]).toEqual([true])
    })
  })

  describe('选择摘要功能', () => {
    it('应该在选择平台后显示格式摘要', () => {
      const wrapper = createWrapper({
        modelValue: ['windows', 'macos'],
      })

      const summary = wrapper.find('.bg-blue-50')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toContain('将生成以下格式')
      expect(summary.text()).toContain('Windows: ICO 文件')
      expect(summary.text()).toContain('macOS: ICNS 文件')
    })

    it('应该在未选择平台时隐藏格式摘要', () => {
      const wrapper = createWrapper()

      const summary = wrapper.find('.bg-blue-50')
      expect(summary.exists()).toBe(false)
    })

    it('应该为单尺寸格式显示具体尺寸信息', () => {
      const wrapper = createWrapper({
        modelValue: ['macos'],
      })

      const summary = wrapper.find('.bg-blue-50')
      expect(summary.text()).toContain('ICNS 文件 (1024px)')
    })

    it('应该为多尺寸格式显示尺寸数量', () => {
      const wrapper = createWrapper({
        modelValue: ['windows'],
      })

      const summary = wrapper.find('.bg-blue-50')
      expect(summary.text()).toContain('ICO 文件 (6 种尺寸)')
    })
  })

  describe('平台图标测试', () => {
    it('应该为不同平台显示正确的图标', () => {
      const wrapper = createWrapper()

      const windowsIcon = wrapper.find('[data-name="i-simple-icons-windows"]')
      const appleIcon = wrapper.find('[data-name="i-simple-icons-apple"]')
      const linuxIcon = wrapper.find('[data-name="i-simple-icons-linux"]')

      expect(windowsIcon.exists()).toBe(true)
      expect(appleIcon.exists()).toBe(true)
      expect(linuxIcon.exists()).toBe(true)
    })
  })

  describe('响应式设计测试', () => {
    it('应该使用网格布局显示平台选项', () => {
      const wrapper = createWrapper()

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('sm:grid-cols-3')
    })
  })
})
