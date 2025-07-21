import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as fileUtils from '~/utils/file-utils'
import FileUploadZone from '../FileUploadZone.vue'

// Mock DragEvent and DataTransfer for testing
class MockDataTransfer {
  items = {
    add: vi.fn(),
  }

  files: FileList = [] as unknown as FileList
  dropEffect = 'none'
}

class MockDragEvent extends Event {
  dataTransfer: MockDataTransfer | null = null

  constructor(type: string, eventInitDict?: { dataTransfer?: MockDataTransfer }) {
    super(type)
    this.dataTransfer = eventInitDict?.dataTransfer || null
  }
}

// @ts-expect-error - Mocking global DragEvent
globalThis.DragEvent = MockDragEvent
// @ts-expect-error - Mocking global DataTransfer
globalThis.DataTransfer = MockDataTransfer

// Mock the file-utils module
vi.mock('~/utils/file-utils', () => ({
  validateFileComplete: vi.fn(),
}))

// Create a simple stub for Nuxt UI components
function createStubComponent(name: string) {
  return {
    name,
    template: `<div class="mock-${name.toLowerCase()}" v-bind="$attrs"><slot /></div>`,
    inheritAttrs: false,
  }
}

describe('fileUploadZone', () => {
  let wrapper: ReturnType<typeof mount>
  const mockValidateFileComplete = vi.mocked(fileUtils.validateFileComplete)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(FileUploadZone, {
      global: {
        stubs: {
          UIcon: createStubComponent('UIcon'),
          UAlert: createStubComponent('UAlert'),
        },
      },
    })
  })

  describe('渲染', () => {
    it('应该正确渲染上传区域', () => {
      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.text()).toContain('拖拽图像文件到此处')
      expect(wrapper.text()).toContain('点击选择文件')
    })

    it('应该显示支持的文件格式信息', () => {
      expect(wrapper.text()).toContain('支持格式：PNG、JPG、JPEG、SVG、WebP')
      expect(wrapper.text()).toContain('最大文件大小：10MB')
    })

    it('应该包含隐藏的文件输入框', () => {
      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.exists()).toBe(true)
      expect(fileInput.attributes('accept')).toBe('image/png,image/jpeg,image/jpg,image/svg+xml,image/webp')
    })
  })

  describe('文件上传交互', () => {
    it('应该在点击时触发文件选择', async () => {
      const fileInput = wrapper.find('input[type="file"]')
      const clickSpy = vi.spyOn(fileInput.element, 'click').mockImplementation(() => {})

      await wrapper.trigger('click')
      expect(clickSpy).toHaveBeenCalled()
    })

    it('应该处理文件选择事件', async () => {
      mockValidateFileComplete.mockResolvedValue({ valid: true })

      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const fileInput = wrapper.find('input[type="file"]')

      // 模拟文件选择
      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')

      expect(mockValidateFileComplete).toHaveBeenCalledWith(file, {})
    })

    it('应该在文件验证成功后触发upload事件', async () => {
      mockValidateFileComplete.mockResolvedValue({ valid: true })

      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('upload')).toBeTruthy()
      expect(wrapper.emitted('upload')?.[0]).toEqual([file])
    })

    it('应该在文件验证失败后触发error事件', async () => {
      const errorMessage = '文件格式不支持'
      mockValidateFileComplete.mockResolvedValue({
        valid: false,
        error: errorMessage,
      })

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('error')).toBeTruthy()
      expect(wrapper.emitted('error')?.[0]).toEqual([errorMessage])
    })
  })

  describe('拖拽功能', () => {
    it('应该在拖拽进入时更新样式', async () => {
      await wrapper.trigger('dragover', {
        dataTransfer: {
          dropEffect: 'copy',
        },
      })

      // Check if drag over class is applied
      expect(wrapper.classes()).toContain('border-primary-500')
    })

    it('应该在拖拽离开时重置样式', async () => {
      // 先进入拖拽状态
      await wrapper.trigger('dragover', {
        dataTransfer: {
          dropEffect: 'copy',
        },
      })

      // 然后离开
      await wrapper.trigger('dragleave')

      // Check if drag over class is removed
      expect(wrapper.classes()).not.toContain('border-primary-500')
    })

    it('应该处理文件拖放', async () => {
      mockValidateFileComplete.mockResolvedValue({ valid: true })

      const file = new File(['test'], 'test.png', { type: 'image/png' })

      await wrapper.trigger('drop', {
        dataTransfer: {
          files: [file],
        },
      })

      expect(mockValidateFileComplete).toHaveBeenCalledWith(file, {})
    })
  })

  describe('禁用状态', () => {
    it('应该在disabled为true时禁用交互', async () => {
      wrapper = mount(FileUploadZone, {
        props: { disabled: true },
        global: {
          stubs: {
            UIcon: createStubComponent('UIcon'),
            UAlert: createStubComponent('UAlert'),
          },
        },
      })

      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('cursor-not-allowed')
    })
  })

  describe('错误处理', () => {
    it('应该处理验证过程中的异常', async () => {
      mockValidateFileComplete.mockRejectedValue(new Error('验证失败'))

      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('error')).toBeTruthy()
      expect(wrapper.emitted('error')?.[0]?.[0]).toContain('验证失败')
    })
  })

  describe('自定义验证选项', () => {
    it('应该传递自定义验证选项', async () => {
      const customOptions = { maxSize: 5 * 1024 * 1024 }
      wrapper = mount(FileUploadZone, {
        props: { validationOptions: customOptions },
        global: {
          stubs: {
            UIcon: createStubComponent('UIcon'),
            UAlert: createStubComponent('UAlert'),
          },
        },
      })

      mockValidateFileComplete.mockResolvedValue({ valid: true })

      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false,
      })

      await fileInput.trigger('change')

      expect(mockValidateFileComplete).toHaveBeenCalledWith(file, customOptions)
    })
  })
})
