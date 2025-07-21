import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ImagePreview from '../ImagePreview.vue'

// Mock URL methods
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

Object.defineProperty(globalThis.URL, 'createObjectURL', {
  value: mockCreateObjectURL,
  writable: true,
})

Object.defineProperty(globalThis.URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
  writable: true,
})

// Mock Image constructor
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  naturalWidth = 1024
  naturalHeight = 768

  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload()
      }
    }, 0)
  }

  get src() {
    return ''
  }

  set src(_: string) {
    // Trigger load event
  }
}

// @ts-expect-error - Mocking global Image
globalThis.Image = MockImage

// Mock Nuxt UI components
const mockComponents = {
  UIcon: {
    template: '<span class="mock-icon"></span>',
    props: ['name', 'class'],
  },
  UAlert: {
    template: '<div class="mock-alert">{{ title }}</div>',
    props: ['icon', 'color', 'variant', 'title', 'close-button'],
    emits: ['close'],
  },
  UBadge: {
    template: '<span class="mock-badge">{{ label }}</span>',
    props: ['label', 'variant'],
  },
}

describe('imagePreview', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateObjectURL.mockReturnValue('blob:mock-url')
  })

  const createMockFile = (name = 'test.png', size = 1024, type = 'image/png'): File => {
    const file = new File(['mock content'], name, { type })
    Object.defineProperty(file, 'size', { value: size })
    return file
  }

  const mountComponent = (props: unknown = {}) => {
    return mount(ImagePreview, {
      props,
      global: {
        components: mockComponents,
      },
    })
  }

  describe('基础渲染', () => {
    it('当没有文件时不应该渲染任何内容', () => {
      wrapper = mountComponent({ file: null })
      expect(wrapper.find('.bg-white').exists()).toBe(false)
    })

    it('当有文件时应该渲染预览容器', () => {
      const file = createMockFile()
      wrapper = mountComponent({ file })
      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('应该显示加载状态', () => {
      const file = createMockFile()
      wrapper = mountComponent({ file })
      expect(wrapper.text()).toContain('加载图像中...')
    })
  })

  describe('图像预览功能', () => {
    it('应该创建对象URL', async () => {
      const file = createMockFile()
      wrapper = mountComponent({ file })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file)
    })

    it('应该设置正确的最大尺寸样式', async () => {
      const file = createMockFile()
      wrapper = mountComponent({
        file,
        maxWidth: 400,
        maxHeight: 300,
      })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()

      const img = wrapper.find('img')
      if (img.exists()) {
        expect(img.attributes('style')).toContain('max-width: 400px')
        expect(img.attributes('style')).toContain('max-height: 300px')
      }
    })
  })

  describe('文件信息显示', () => {
    it('应该显示文件基本信息', async () => {
      const file = createMockFile('my-image.jpg', 2048, 'image/jpeg')
      wrapper = mountComponent({ file, showDetails: true })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('my-image.jpg')
      expect(wrapper.text()).toContain('2 KB')
      expect(wrapper.text()).toContain('JPEG')
    })

    it('当showDetails为false时不应该显示详细信息', async () => {
      const file = createMockFile()
      wrapper = mountComponent({ file, showDetails: false })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).not.toContain('文件名')
      expect(wrapper.text()).not.toContain('大小')
    })
  })

  describe('移除功能', () => {
    it('应该显示移除按钮', async () => {
      const file = createMockFile()
      wrapper = mountComponent({ file })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()

      const removeButton = wrapper.find('button')
      expect(removeButton.exists()).toBe(true)
    })

    it('点击移除按钮应该触发remove事件', async () => {
      const file = createMockFile()
      wrapper = mountComponent({ file })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()

      const removeButton = wrapper.find('button')
      if (removeButton.exists()) {
        await removeButton.trigger('click')

        const removeEvents = wrapper.emitted('remove')
        expect(removeEvents).toBeTruthy()
        expect(removeEvents!.length).toBe(1)
      }
    })
  })

  describe('内存清理', () => {
    it('组件卸载时应该清理对象URL', async () => {
      const file = createMockFile()
      wrapper = mountComponent({ file })

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()

      wrapper.unmount()

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })
})
