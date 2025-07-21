// 文件处理工具函数

import type { FileValidationOptions, ValidationResult } from '~/types'

/**
 * 支持的图像文件类型
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
] as const

/**
 * 默认文件验证选项
 */
export const DEFAULT_FILE_VALIDATION_OPTIONS: FileValidationOptions = {
  allowedTypes: [...SUPPORTED_IMAGE_TYPES],
  maxSize: 10 * 1024 * 1024, // 10MB
  minDimensions: {
    width: 16,
    height: 16,
  },
  maxDimensions: {
    width: 4096,
    height: 4096,
  },
}

/**
 * 验证上传的图像文件
 * @param file 要验证的文件
 * @param options 验证选项
 * @returns 验证结果
 */
export function validateImageFile(
  file: File,
  options: Partial<FileValidationOptions> = {},
): ValidationResult {
  const opts = { ...DEFAULT_FILE_VALIDATION_OPTIONS, ...options }

  // 检查文件类型
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `不支持的文件格式。支持的格式：${opts.allowedTypes.map((type: string) => type.split('/')[1]?.toUpperCase() || '').join('、')}`,
    }
  }

  // 检查文件大小
  if (file.size > opts.maxSize) {
    const maxSizeMB = Math.round(opts.maxSize / (1024 * 1024))
    return {
      valid: false,
      error: `文件大小超过限制。最大允许 ${maxSizeMB}MB，当前文件 ${Math.round(file.size / (1024 * 1024) * 100) / 100}MB`,
    }
  }

  // 检查文件是否为空
  if (file.size === 0) {
    return {
      valid: false,
      error: '文件为空，请选择有效的图像文件',
    }
  }

  return { valid: true }
}

/**
 * 异步验证图像尺寸
 * @param file 图像文件
 * @param options 验证选项
 * @returns Promise<ValidationResult>
 */
export async function validateImageDimensions(
  file: File,
  options: Partial<FileValidationOptions> = {},
): Promise<ValidationResult> {
  const opts = { ...DEFAULT_FILE_VALIDATION_OPTIONS, ...options }

  return new Promise((resolve) => {
    // SVG文件跳过尺寸检查
    if (file.type === 'image/svg+xml') {
      resolve({ valid: true })
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const { width, height } = img

      // 检查最小尺寸
      if (opts.minDimensions && (width < opts.minDimensions.width || height < opts.minDimensions.height)) {
        resolve({
          valid: false,
          error: `图像尺寸过小。最小要求 ${opts.minDimensions.width}x${opts.minDimensions.height}px，当前 ${width}x${height}px`,
        })
        return
      }

      // 检查最大尺寸
      if (opts.maxDimensions && (width > opts.maxDimensions.width || height > opts.maxDimensions.height)) {
        resolve({
          valid: false,
          error: `图像尺寸过大。最大允许 ${opts.maxDimensions.width}x${opts.maxDimensions.height}px，当前 ${width}x${height}px`,
        })
        return
      }

      resolve({ valid: true })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: false,
        error: '无法读取图像文件，请确保文件未损坏',
      })
    }

    img.src = url
  })
}

/**
 * 完整的文件验证（包括尺寸检查）
 * @param file 要验证的文件
 * @param options 验证选项
 * @returns Promise<ValidationResult>
 */
export async function validateFileComplete(
  file: File,
  options: Partial<FileValidationOptions> = {},
): Promise<ValidationResult> {
  // 首先进行基础验证
  const basicValidation = validateImageFile(file, options)
  if (!basicValidation.valid) {
    return basicValidation
  }

  // 然后进行尺寸验证
  return await validateImageDimensions(file, options)
}

/**
 * 格式化文件大小显示
 * @param bytes 字节数
 * @returns 格式化的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Math.round(bytes / k ** i * 100) / 100} ${sizes[i]}`
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名（小写）
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
}

/**
 * 检查是否为支持的图像类型
 * @param mimeType MIME类型
 * @returns 是否支持
 */
export function isSupportedImageType(mimeType: string): boolean {
  return (SUPPORTED_IMAGE_TYPES as readonly string[]).includes(mimeType)
}
