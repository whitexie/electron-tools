// 验证相关类型定义

/**
 * 验证结果接口
 */
export interface ValidationResult {
  /** 验证是否通过 */
  valid: boolean
  /** 错误信息（如果验证失败） */
  error?: string
  /** 警告信息 */
  warning?: string
}

/**
 * 文件验证选项
 */
export interface FileValidationOptions {
  /** 允许的文件类型 */
  allowedTypes: string[]
  /** 最大文件大小（字节） */
  maxSize: number
  /** 最小图像尺寸 */
  minDimensions?: {
    width: number
    height: number
  }
  /** 最大图像尺寸 */
  maxDimensions?: {
    width: number
    height: number
  }
}

/**
 * 平台选择验证结果
 */
export interface PlatformSelectionValidation extends ValidationResult {
  /** 选中的平台数量 */
  selectedCount: number
  /** 是否至少选择了一个平台 */
  hasSelection: boolean
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
  FILE_UPLOAD = 'FILE_UPLOAD',
  IMAGE_PROCESSING = 'IMAGE_PROCESSING',
  FORMAT_CONVERSION = 'FORMAT_CONVERSION',
  DOWNLOAD_GENERATION = 'DOWNLOAD_GENERATION',
}

/**
 * 应用错误接口
 */
export interface AppError {
  /** 错误类型 */
  type: ErrorType
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: string
  /** 是否可恢复 */
  recoverable: boolean
  /** 错误发生时间 */
  timestamp?: Date
}
