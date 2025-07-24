import type { ConversionResult, PlatformId } from '~/types'
import { reactive, ref } from 'vue'
import { convertPngFilesToIcns, generateMultiSizePngs } from '~/converters'
import { convertPngFilesToIco } from '~/converters/icoGenerator'
import { getPlatformConfig, getPlatformSizes, unique } from '~/utils'

export function useConverter() {
  const isConverting = ref(false)
  const selectedPlatforms = ref<PlatformId[]>([])
  const pngFiles = ref<Map<number, File>>(new Map())

  const conversionResults = reactive<ConversionResult[]>([])

  async function startConversion(sourceImage: File) {
    isConverting.value = true

    // 清空之前的转换结果
    conversionResults.splice(0)

    try {
      const _files = await generatePngFiles(selectedPlatforms.value, sourceImage)

      if (!_files) {
        throw new Error('PNG文件生成失败')
      }

      pngFiles.value = _files

      // 并行处理所有平台转换
      const conversionPromises = selectedPlatforms.value.map(platformId =>
        convertPlatform(platformId, _files),
      )

      const results = await Promise.allSettled(conversionPromises)

      // 处理转换结果
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          conversionResults.push(result.value)
        }
        else {
          console.error(`平台 ${selectedPlatforms.value[index]} 转换失败:`, result.reason)
          // 添加失败结果
          conversionResults.push({
            platform: selectedPlatforms.value[index]!,
            files: [],
            success: false,
            error: result.reason?.message || '转换失败',
          })
        }
      })
    }
    catch (e) {
      console.error('转换过程出错:', e)
      throw e
    }
    finally {
      isConverting.value = false
    }
  }

  /**
   * 转换单个平台的图标
   */
  async function convertPlatform(platformId: PlatformId, pngFiles: Map<number, File>): Promise<ConversionResult> {
    const config = getPlatformConfig(platformId)

    // 构建该平台需要的文件映射
    const selectedFileMap = new Map<number, File>()
    config.format.sizes.forEach((size) => {
      const file = pngFiles.get(size)
      if (!file) {
        throw new Error(`缺少尺寸为 ${size}px 的PNG文件`)
      }
      selectedFileMap.set(size, file)
    })

    const fileList = [...selectedFileMap.values()]

    switch (config.id) {
      case 'macos':
        return await convertPngFilesToIcns(fileList)

      case 'windows':
        return await convertPngFilesToIco(selectedFileMap)

      case 'linux':
        return {
          platform: 'linux',
          files: fileList.map((blob, index) => {
            const { size, type: format } = blob
            const dimensions = `${config.format.sizes[index]}`
            const name = `${dimensions}x${dimensions}.png`

            return { name, blob, size, format, dimensions }
          }),
          success: true,
        }

      default:
        throw new Error(`不支持的平台: ${config.id}`)
    }
  }

  return {
    isConverting,
    pngFiles,
    selectedPlatforms,
    conversionResults,
    startConversion,
  }
}

/**
 * 开始转换
 * @param platformIds 需要转换的平台Ids
 * @param sourceImage 源图片
 */
async function generatePngFiles(platformIds: PlatformId[], sourceImage: File) {
  if (platformIds.length === 0) {
    return
  }

  platformIds.reduce((acc, id) => {
    const sizes = getPlatformSizes(id)
    return acc.concat(sizes)
  }, [] as number[])

  const sizes = unique(
    platformIds.map(getPlatformSizes).flat(),
  )

  return await generateMultiSizePngs(sourceImage, sizes)
}
