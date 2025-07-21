// 服务和业务逻辑相关类型定义

/**
 * 生成的文件接口
 */
export interface GeneratedFile {
  /** 文件名 */
  name: string
  /** 文件Blob对象 */
  blob: Blob
  /** 文件大小（字节） */
  size: number
  /** 文件格式 */
  format: string
  /** 图标尺寸 */
  dimensions?: string
}

/**
 * 转换结果接口
 */
export interface ConversionResult {
  /** 目标平台 */
  platform: string
  /** 生成的文件列表 */
  files: GeneratedFile[]
  /** 转换是否成功 */
  success: boolean
  /** 错误信息（如果有） */
  error?: string
  /** 转换耗时（毫秒） */
  duration?: number
}

/**
 * 转换进度状态
 */
export interface ConversionProgress {
  /** 当前步骤 */
  currentStep: string
  /** 进度百分比 (0-100) */
  progress: number
  /** 是否正在处理 */
  isProcessing: boolean
  /** 已完成的平台数量 */
  completedPlatforms: number
  /** 总平台数量 */
  totalPlatforms: number
}

/**
 * 应用状态接口
 */
export interface AppState {
  /** 源文件 */
  sourceFile: File | null
  /** 图像预览URL */
  imagePreview: string | null
  /** 选中的平台集合 */
  selectedPlatforms: Set<string>
  /** 转换进度 */
  progress: ConversionProgress
  /** 转换结果映射 */
  results: Map<string, ConversionResult>
  /** 下载是否准备就绪 */
  downloadReady: boolean
}