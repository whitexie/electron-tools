import type { ConversionProgress as ConversionProgressType } from '~/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConversionProgress from '../ConversionProgress.vue'

// Mock Nuxt UI components
const UIcon = {
  name: 'UIcon',
  template: '<span class="mock-icon" :class="[$attrs.class]"><slot /></span>',
  props: ['name'],
  inheritAttrs: true,
}

const UAlert = {
  name: 'UAlert',
  template: '<div class="mock-alert" :class="[`color-${color}`]"><slot /></div>',
  props: ['icon', 'color', 'variant', 'title', 'description', 'close-button'],
  emits: ['close'],
}

describe('conversionProgress', () => {
  const createMockProgress = (overrides: Partial<ConversionProgressType> = {}): ConversionProgressType => ({
    currentStep: '正在处理图像...',
    progress: 0,
    isProcessing: false,
    completedPlatforms: 0,
    totalPlatforms: 3,
    ...overrides,
  })

  const mountComponent = (props: any) => {
    return mount(ConversionProgress, {
      props,
      global: {
        components: {
          UIcon,
          UAlert,
        },
      },
    })
  }

  describe('渲染测试', () => {
    it('当进度为0且未处理时不显示组件', () => {
      const progress = createMockProgress()
      const wrapper = mountComponent({ progress })

      expect(wrapper.find('.w-full').exists()).toBe(false)
    })

    it('当正在处理时显示进度组件', () => {
      const progress = createMockProgress({
        isProcessing: true,
        progress: 25,
        currentStep: '正在生成Windows图标...',
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.find('.w-full').exists()).toBe(true)
      expect(wrapper.text()).toContain('转换进度')
      expect(wrapper.text()).toContain('正在生成Windows图标...')
      expect(wrapper.text()).toContain('25%')
    })

    it('当进度大于0时显示进度组件', () => {
      const progress = createMockProgress({
        progress: 50,
        currentStep: '正在生成macOS图标...',
        completedPlatforms: 1,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.find('.w-full').exists()).toBe(true)
      expect(wrapper.text()).toContain('1/3 平台完成')
    })
  })

  describe('进度显示测试', () => {
    it('正确显示进度百分比', () => {
      const progress = createMockProgress({
        progress: 75.6,
        isProcessing: true,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('76%') // 四舍五入
    })

    it('正确设置进度条宽度', () => {
      const progress = createMockProgress({
        progress: 60,
        isProcessing: true,
      })

      const wrapper = mountComponent({ progress })

      const progressBar = wrapper.find('.bg-primary-600')
      expect(progressBar.attributes('style')).toContain('width: 60%')
    })

    it('显示当前步骤信息', () => {
      const progress = createMockProgress({
        currentStep: '正在生成Linux图标...',
        progress: 80,
        isProcessing: true,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('正在生成Linux图标...')
    })

    it('显示平台完成计数', () => {
      const progress = createMockProgress({
        completedPlatforms: 2,
        totalPlatforms: 3,
        progress: 66,
        isProcessing: true,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('2/3 平台完成')
    })
  })

  describe('状态指示器测试', () => {
    it('处理中时显示旋转图标和文本', () => {
      const progress = createMockProgress({
        isProcessing: true,
        progress: 30,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('正在处理...')
      // Check for the mock icon with animate-spin class
      const spinIcon = wrapper.find('.mock-icon')
      expect(spinIcon.exists()).toBe(true)
      expect(spinIcon.classes()).toContain('animate-spin')
    })

    it('完成时显示成功图标和文本', () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 100,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('转换完成')
      const checkIcon = wrapper.find('.text-green-600')
      expect(checkIcon.exists()).toBe(true)
    })

    it('未完成且未处理时不显示状态指示器', () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 50,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).not.toContain('正在处理...')
      expect(wrapper.text()).not.toContain('转换完成')
    })
  })

  describe('错误状态测试', () => {
    it('显示错误消息', () => {
      const progress = createMockProgress({ progress: 50 })
      const wrapper = mountComponent({
        progress,
        errorMessage: '转换失败：不支持的图像格式',
        errorTitle: '格式错误',
      })

      const alert = wrapper.find('.color-error')
      expect(alert.exists()).toBe(true)
    })

    it('不显示错误消息当errorMessage为空时', () => {
      const progress = createMockProgress({ progress: 50 })
      const wrapper = mountComponent({ progress })

      const alert = wrapper.find('.color-red')
      expect(alert.exists()).toBe(false)
    })

    it('触发清除错误事件', async () => {
      const progress = createMockProgress({ progress: 50 })
      const wrapper = mountComponent({
        progress,
        errorMessage: '测试错误',
      })

      const alert = wrapper.findComponent(UAlert)
      await alert.vm.$emit('close')

      expect(wrapper.emitted('clearError')).toBeTruthy()
      expect(wrapper.emitted('clearError')).toHaveLength(1)
    })
  })

  describe('成功状态测试', () => {
    it('完成时显示成功提示', () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 100,
      })

      const wrapper = mountComponent({
        progress,
        showSuccess: true,
      })

      const successAlert = wrapper.find('.color-green')
      expect(successAlert.exists()).toBe(true)
    })

    it('未完成时不显示成功提示', () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 80,
      })

      const wrapper = mountComponent({
        progress,
        showSuccess: true,
      })

      const successAlert = wrapper.find('.color-green')
      expect(successAlert.exists()).toBe(false)
    })

    it('处理中时不显示成功提示', () => {
      const progress = createMockProgress({
        isProcessing: true,
        progress: 100,
      })

      const wrapper = mountComponent({
        progress,
        showSuccess: true,
      })

      const successAlert = wrapper.find('.color-green')
      expect(successAlert.exists()).toBe(false)
    })

    it('showSuccess为false时不显示成功提示', () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 100,
      })

      const wrapper = mountComponent({
        progress,
        showSuccess: false,
      })

      const successAlert = wrapper.find('.color-green')
      expect(successAlert.exists()).toBe(false)
    })

    it('触发隐藏成功提示事件', async () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 100,
      })

      const wrapper = mountComponent({
        progress,
        showSuccess: true,
      })

      const alerts = wrapper.findAllComponents(UAlert)
      const successAlert = alerts.find(alert =>
        alert.classes().includes('color-green'),
      )

      expect(successAlert).toBeDefined()
      await successAlert!.vm.$emit('close')

      expect(wrapper.emitted('hideSuccess')).toBeTruthy()
      expect(wrapper.emitted('hideSuccess')).toHaveLength(1)
    })
  })

  describe('props默认值测试', () => {
    it('使用默认的错误标题', () => {
      const progress = createMockProgress({ progress: 50 })
      const wrapper = mountComponent({
        progress,
        errorMessage: '测试错误',
      })

      // 检查是否使用了默认的错误标题
      expect(wrapper.vm.errorTitle).toBe('转换错误')
    })

    it('使用默认的showSuccess值', () => {
      const progress = createMockProgress({
        isProcessing: false,
        progress: 100,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.vm.showSuccess).toBe(true)
    })
  })

  describe('边界情况测试', () => {
    it('处理进度为0的情况', () => {
      const progress = createMockProgress({
        progress: 0,
        isProcessing: true,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('0%')
      const progressBar = wrapper.find('.bg-primary-600')
      expect(progressBar.attributes('style')).toContain('width: 0%')
    })

    it('处理进度为100的情况', () => {
      const progress = createMockProgress({
        progress: 100,
        isProcessing: false,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('100%')
      const progressBar = wrapper.find('.bg-primary-600')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })

    it('处理小数进度值', () => {
      const progress = createMockProgress({
        progress: 33.333,
        isProcessing: true,
      })

      const wrapper = mountComponent({ progress })

      expect(wrapper.text()).toContain('33%') // 四舍五入
    })
  })
})
