// 平台相关工具函数和常量

import type { PlatformConfig, PlatformId } from '../types/platform'
import { PLATFORM_CONFIGS } from '~/constants'

/**
 * 获取平台配置
 */
export function getPlatformConfig(platformId: PlatformId): PlatformConfig {
  return PLATFORM_CONFIGS[platformId]
}

export function getPlatformSizes(platformId: PlatformId): number[] {
  const item = getPlatformConfig(platformId)
  return item.format.sizes
}
