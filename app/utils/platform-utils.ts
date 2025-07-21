// 平台相关工具函数和常量

import type { PlatformConfig, PlatformConfigs, PlatformId } from '../types/platform'

/**
 * 平台规范配置常量
 * 定义Windows、macOS、Linux的图标尺寸和格式要求
 */
export const PLATFORM_CONFIGS: PlatformConfigs = {
  windows: {
    id: 'windows',
    name: 'Windows',
    formats: [{
      extension: 'ico',
      sizes: [16, 32, 48, 64, 128, 256],
      mimeType: 'image/x-icon',
    }],
    enabled: true,
  },
  macos: {
    id: 'macos',
    name: 'macOS',
    formats: [{
      extension: 'icns',
      sizes: [1024],
      mimeType: 'image/icns',
    }],
    enabled: true,
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    formats: [{
      extension: 'png',
      sizes: [16, 32, 48, 64, 128, 256, 512],
      mimeType: 'image/png',
    }],
    enabled: true,
  },
}

/**
 * 获取平台配置
 */
export function getPlatformConfig(platformId: PlatformId): PlatformConfig {
  return PLATFORM_CONFIGS[platformId]
}

/**
 * 获取所有启用的平台
 */
export function getEnabledPlatforms(): PlatformConfig[] {
  return Object.values(PLATFORM_CONFIGS).filter(config => config.enabled)
}

/**
 * 获取平台支持的所有尺寸
 */
export function getPlatformSizes(platformId: PlatformId): number[] {
  const config = getPlatformConfig(platformId)
  return config.formats.flatMap(format => format.sizes)
}

/**
 * 检查平台是否支持指定格式
 */
export function isPlatformFormatSupported(platformId: PlatformId, extension: string): boolean {
  const config = getPlatformConfig(platformId)
  return config.formats.some(format => format.extension === extension)
}

/**
 * 获取平台的主要文件扩展名
 */
export function getPlatformMainExtension(platformId: PlatformId): string {
  const config = getPlatformConfig(platformId)
  return config.formats[0]?.extension || 'png'
}
