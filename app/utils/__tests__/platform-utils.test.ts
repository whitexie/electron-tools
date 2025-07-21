import { describe, expect, it } from 'vitest'
import {
  getEnabledPlatforms,
  getPlatformConfig,
  getPlatformMainExtension,
  getPlatformSizes,
  isPlatformFormatSupported,
  PLATFORM_CONFIGS,
} from '../platform-utils'

describe('平台工具函数', () => {
  describe('pLATFORM_CONFIGS', () => {
    it('应该包含所有必需的平台配置', () => {
      expect(PLATFORM_CONFIGS).toBeDefined()
      expect(PLATFORM_CONFIGS.windows).toBeDefined()
      expect(PLATFORM_CONFIGS.macos).toBeDefined()
      expect(PLATFORM_CONFIGS.linux).toBeDefined()
    })

    it('windows平台应该有正确的配置', () => {
      const _windows = PLATFORM_CONFIGS.windows
      expect(_windows.id).toBe('windows')
      expect(_windows.name).toBe('Windows')
      expect(_windows.formats[0]?.extension).toBe('ico')
      expect(_windows.formats[0]?.sizes).toEqual([16, 32, 48, 64, 128, 256])
      expect(_windows.enabled).toBe(true)
    })

    it('macOS平台应该有正确的配置', () => {
      const macos = PLATFORM_CONFIGS.macos
      expect(macos.id).toBe('macos')
      expect(macos.name).toBe('macOS')
      expect(macos.formats[0]?.extension).toBe('icns')
      expect(macos.formats[0]?.sizes).toEqual([1024])
      expect(macos.enabled).toBe(true)
    })

    it('linux平台应该有正确的配置', () => {
      const linux = PLATFORM_CONFIGS.linux
      expect(linux.id).toBe('linux')
      expect(linux.name).toBe('Linux')
      expect(linux.formats[0]?.extension).toBe('png')
      expect(linux.formats[0]?.sizes).toEqual([16, 32, 48, 64, 128, 256, 512])
      expect(linux.enabled).toBe(true)
    })
  })

  describe('getPlatformConfig', () => {
    it('应该返回正确的平台配置', () => {
      const windowsConfig = getPlatformConfig('windows')
      expect(windowsConfig.id).toBe('windows')
      expect(windowsConfig.name).toBe('Windows')
    })
  })

  describe('getEnabledPlatforms', () => {
    it('应该返回所有启用的平台', () => {
      const enabledPlatforms = getEnabledPlatforms()
      expect(enabledPlatforms).toHaveLength(3)
      expect(enabledPlatforms.every(p => p.enabled)).toBe(true)
    })
  })

  describe('getPlatformSizes', () => {
    it('应该返回Windows平台的所有尺寸', () => {
      const sizes = getPlatformSizes('windows')
      expect(sizes).toEqual([16, 32, 48, 64, 128, 256])
    })

    it('应该返回Linux平台的所有尺寸', () => {
      const sizes = getPlatformSizes('linux')
      expect(sizes).toEqual([16, 32, 48, 64, 128, 256, 512])
    })
  })

  describe('isPlatformFormatSupported', () => {
    it('应该正确检测Windows平台支持的格式', () => {
      expect(isPlatformFormatSupported('windows', 'ico')).toBe(true)
      expect(isPlatformFormatSupported('windows', 'png')).toBe(false)
    })

    it('应该正确检测macOS平台支持的格式', () => {
      expect(isPlatformFormatSupported('macos', 'icns')).toBe(true)
      expect(isPlatformFormatSupported('macos', 'ico')).toBe(false)
    })
  })

  describe('getPlatformMainExtension', () => {
    it('应该返回平台的主要文件扩展名', () => {
      expect(getPlatformMainExtension('windows')).toBe('ico')
      expect(getPlatformMainExtension('macos')).toBe('icns')
      expect(getPlatformMainExtension('linux')).toBe('png')
    })
  })
})
