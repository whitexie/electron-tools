import type { PlatformConfig, PlatformConfigs, PlatformId } from '~/types/platform'

/**
 * 平台规范配置常量
 * 定义Windows、macOS、Linux的图标尺寸和格式要求
 */
export const PLATFORM_CONFIGS: PlatformConfigs = {
  windows: {
    id: 'windows',
    name: 'Windows',
    format: {
      extension: 'ico',
      sizes: [16, 24, 32, 48, 64, 128, 256],
      mimeType: 'image/x-icon',
    },
  },
  macos: {
    id: 'macos',
    name: 'macOS',
    format: {
      extension: 'icns',
      sizes: [16, 32, 64, 128, 256, 512, 1024],
      mimeType: 'image/icns',
    },
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    format: {
      extension: 'png',
      sizes: [16, 32, 48, 64, 96, 128, 256, 512],
      mimeType: 'image/png',
    },
  },
} as const

/**
 * 获取平台配置
 */
export function getPlatformConfig(platformId: PlatformId): PlatformConfig {
  return PLATFORM_CONFIGS[platformId]
}
