// Canvas和图像处理相关类型定义

/**
 * 图像处理结果接口
 */
export interface ImageProcessingResult {
  /** 处理后的Canvas元素 */
  canvas: HTMLCanvasElement
  /** 图像数据URL */
  dataUrl: string
  /** 图像宽度 */
  width: number
  /** 图像高度 */
  height: number
}

/**
 * 图像缩放选项
 */
export interface ResizeOptions {
  /** 目标宽度 */
  width: number
  /** 目标高度 */
  height: number
  /** 缩放质量 (0-1) */
  quality?: number
  /** 是否保持宽高比 */
  maintainAspectRatio?: boolean
}

/**
 * Canvas渲染上下文类型
 */
export type CanvasContext = CanvasRenderingContext2D

/**
 * 图像加载结果
 */
export interface ImageLoadResult {
  /** 加载的图像元素 */
  image: HTMLImageElement
  /** 原始宽度 */
  originalWidth: number
  /** 原始高度 */
  originalHeight: number
}
