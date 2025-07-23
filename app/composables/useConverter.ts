import { convertPngFilesToIcns, generateMultiSizePngs } from '~/converters'
import { convertPngFilesToIco } from '~/converters/icoGenerator'
import { getPlatformConfig, getPlatformSizes, unique } from '~/utils'

export function useConverter() {
  const isConverting = ref(false)
  const selectedPlatforms = ref<PlatformId[]>([])
  const pngFiles = ref<Record<number, File>>({})

  const conversionResults = reactive<ConversionResult[]>([])

  async function startConversion(sourceImage: File) {
    isConverting.value = true

    try {
      const _files = await generatePngFiles(selectedPlatforms.value, sourceImage)

      if (!_files) {
        throw new Error('generate fail')
      }

      pngFiles.value = _files

      // 遍历selectedPlatforms，开始转换成对应的格式图片
      selectedPlatforms.value.forEach(async (id) => {
        const config = getPlatformConfig(id)

        const files = config.format.sizes.map(size => pngFiles.value[size]!)

        if (config.id === 'macos') {
          const result = await convertPngFilesToIcns(files)
          conversionResults.push(result)
        }
        else if (config.id === 'windows') {
          const _files: Map<number, File> = new Map()
          for (const key in pngFiles.value) {
            const file = pngFiles.value[key]
            const size = Number(key)
            _files.set(size, file!)
          }

          const result = await convertPngFilesToIco(Object.fromEntries(_files))
          conversionResults.push(result)
        }
        else {
          conversionResults.push({
            platform: 'linux',
            files: files.map((blob, index) => {
              const { size, type: format } = blob
              const dimensions = `${config.format.sizes[index]}`
              const name = `${[dimensions, dimensions].join('x')}.png`

              return { name, blob, size, format, dimensions }
            }),
            success: true,
          })
        }
      })
    }
    catch (e) {
      console.error(e)
      throw e
    }
    finally {
      isConverting.value = false
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
