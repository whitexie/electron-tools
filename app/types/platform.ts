// 平台配置相关类型定义

/**
 * 支持的平台类型
 */
export type PlatformId = 'windows' | 'macos' | 'linux'

export interface Platform {
  id: PlatformId
  name: string
  description: string
  icon: string
}

/**
 * 图标格式配置
 */
export interface IconFormat {
  /** 文件扩展名 */
  extension: string
  /** 支持的尺寸数组 */
  sizes: number[]
  /** MIME类型 */
  mimeType: string
}

/**
 * 平台配置接口
 */
export interface PlatformConfig {
  /** 平台唯一标识 */
  id: PlatformId
  /** 平台显示名称 */
  name: string
  /** 支持的图标格式 */
  formats: IconFormat[]
  /** 是否启用该平台 */
  enabled: boolean
}

/**
 * 平台规范常量类型
 */
export type PlatformConfigs = Record<PlatformId, PlatformConfig>
