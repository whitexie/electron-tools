import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_FILE_VALIDATION_OPTIONS,
  formatFileSize,
  getFileExtension,
  isSupportedImageType,
  SUPPORTED_IMAGE_TYPES,
  validateFileComplete,
  validateImageDimensions,
  validateImageFile,
} from '../file-utils'

// Mock Image constructor
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  width = 0
  height = 0

  private _src = ''

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value
    // 模拟异步加载
    setTimeout(() => {
      if (value.includes('error')) {
        this.onerror?.()
      }
      else {
        this.onload?.()
      }
    }, 0)
  }
}

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

beforeEach(() => {
  // @ts-expect-error - Mocking global Image constructor
  globalThis.Image = MockImage
  // @ts-expect-error - Mocking global URL
  globalThis.URL = {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  }

  mockCreateObjectURL.mockReturnValue('mock-url')
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('file-utils', () => {
  describe('validateImageFile', () => {
    it('应该接受有效的PNG文件', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('应该接受有效的JPG文件', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }) // 2MB

      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('应该接受有效的SVG文件', () => {
      const file = new File([''], 'test.svg', { type: 'image/svg+xml' })
      Object.defineProperty(file, 'size', { value: 512 * 1024 }) // 512KB

      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('应该接受有效的WebP文件', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' })
      Object.defineProperty(file, 'size', { value: 1.5 * 1024 * 1024 }) // 1.5MB

      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('应该拒绝不支持的文件格式', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 })

      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('不支持的文件格式')
    })

    it('应该拒绝超过大小限制的文件', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }) // 15MB

      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('文件大小超过限制')
    })

    it('应该拒绝空文件', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 0 })

      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('文件为空')
    })

    it('应该使用自定义验证选项', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }) // 2MB

      const customOptions = {
        maxSize: 1 * 1024 * 1024, // 1MB限制
      }

      const result = validateImageFile(file, customOptions)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('文件大小超过限制')
    })
  })

  describe('validateImageDimensions', () => {
    it('应该跳过SVG文件的尺寸检查', async () => {
      const file = new File([''], 'test.svg', { type: 'image/svg+xml' })

      const result = await validateImageDimensions(file)
      expect(result.valid).toBe(true)
    })

    it('应该验证图像尺寸', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' })

      // 设置mock图像尺寸
      const mockImg = new MockImage()
      mockImg.width = 512
      mockImg.height = 512

      // @ts-expect-error - Mocking Image constructor
      globalThis.Image = function () { return mockImg }

      const result = await validateImageDimensions(file)
      expect(result.valid).toBe(true)
    })

    it('应该拒绝尺寸过小的图像', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' })

      const mockImg = new MockImage()
      mockImg.width = 8
      mockImg.height = 8

      // @ts-expect-error - Mocking Image constructor
      globalThis.Image = function () { return mockImg }

      const result = await validateImageDimensions(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('图像尺寸过小')
    })

    it('应该拒绝尺寸过大的图像', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' })

      const mockImg = new MockImage()
      mockImg.width = 5000
      mockImg.height = 5000

      // @ts-expect-error - Mocking Image constructor
      globalThis.Image = function () { return mockImg }

      const result = await validateImageDimensions(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('图像尺寸过大')
    })

    it('应该处理图像加载错误', async () => {
      const file = new File([''], 'error.png', { type: 'image/png' })
      mockCreateObjectURL.mockReturnValue('mock-url-error')

      const result = await validateImageDimensions(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('无法读取图像文件')
    })
  })

  describe('validateFileComplete', () => {
    it('应该执行完整的文件验证', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 })

      const mockImg = new MockImage()
      mockImg.width = 512
      mockImg.height = 512

      // @ts-expect-error - Mocking Image constructor
      globalThis.Image = function () { return mockImg }

      const result = await validateFileComplete(file)
      expect(result.valid).toBe(true)
    })

    it('应该在基础验证失败时返回错误', async () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 })

      const result = await validateFileComplete(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('不支持的文件格式')
    })
  })

  describe('formatFileSize', () => {
    it('应该正确格式化字节数', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('应该处理小数点', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })
  })

  describe('getFileExtension', () => {
    it('应该正确提取文件扩展名', () => {
      expect(getFileExtension('test.png')).toBe('png')
      expect(getFileExtension('image.JPG')).toBe('jpg')
      expect(getFileExtension('file.name.svg')).toBe('svg')
      expect(getFileExtension('noextension')).toBe('')
    })
  })

  describe('isSupportedImageType', () => {
    it('应该正确识别支持的图像类型', () => {
      expect(isSupportedImageType('image/png')).toBe(true)
      expect(isSupportedImageType('image/jpeg')).toBe(true)
      expect(isSupportedImageType('image/jpg')).toBe(true)
      expect(isSupportedImageType('image/svg+xml')).toBe(true)
      expect(isSupportedImageType('image/webp')).toBe(true)
      expect(isSupportedImageType('application/pdf')).toBe(false)
      expect(isSupportedImageType('text/plain')).toBe(false)
    })
  })

  describe('常量', () => {
    it('应该定义正确的支持类型', () => {
      expect(SUPPORTED_IMAGE_TYPES).toEqual([
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
        'image/webp',
      ])
    })

    it('应该定义正确的默认验证选项', () => {
      expect(DEFAULT_FILE_VALIDATION_OPTIONS).toEqual({
        allowedTypes: SUPPORTED_IMAGE_TYPES,
        maxSize: 10 * 1024 * 1024,
        minDimensions: {
          width: 16,
          height: 16,
        },
        maxDimensions: {
          width: 4096,
          height: 4096,
        },
      })
    })
  })
})
