import { getImageSize } from '~/utils'

// ICNS文件头标识
const ICNS_MAGIC = 'icns'

// ICNS图标类型映射 - 根据尺寸映射到对应的OSType
const ICNS_TYPES: Record<number, string> = {
  16: 'icp4', // 16x16 PNG
  32: 'icp5', // 32x32 PNG
  64: 'icp6', // 64x64 PNG
  128: 'ic07', // 128x128 PNG
  256: 'ic08', // 256x256 PNG
  512: 'ic09', // 512x512 PNG
  1024: 'ic10', // 1024x1024 PNG
}

export interface IcnsEntry {
  type: string
  size: number
  data: Uint8Array
}

/**
 * 生成ICNS文件二进制数据
 */
export function generateIcnsFile(entries: IcnsEntry[]): Uint8Array {
  // 计算总文件大小
  let totalSize = 8 // ICNS文件头 (4字节magic + 4字节长度)

  for (const entry of entries) {
    totalSize += entry.size
  }

  // 创建输出缓冲区
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const uint8View = new Uint8Array(buffer)

  let offset = 0

  // 写入ICNS文件头
  // Magic number "icns"
  for (let i = 0; i < 4; i++) {
    uint8View[offset + i] = ICNS_MAGIC.charCodeAt(i)
  }
  offset += 4

  // 文件总长度 (大端序)
  view.setUint32(offset, totalSize, false)
  offset += 4

  // 写入每个图标条目
  for (const entry of entries) {
    // 条目类型 (4字节)
    for (let i = 0; i < 4; i++) {
      uint8View[offset + i] = entry.type.charCodeAt(i)
    }
    offset += 4

    // 条目大小 (4字节，大端序)
    view.setUint32(offset, entry.size, false)
    offset += 4

    // 条目数据
    uint8View.set(entry.data, offset)
    offset += entry.data.length
  }

  return uint8View
}

/**
 * 将PNG文件数组转换为ICNS格式
 * @param pngFiles - PNG文件数组，每个文件应该是不同尺寸的图标
 * @param filename - 输出文件名（不含扩展名）
 * @returns 转换结果
 */
export async function convertPngFilesToIcns(
  pngFiles: File[],
  filename: string = 'icon',
): Promise<ConversionResult> {
  try {
    // 验证输入文件
    const validatedFiles = pngFiles
    if (validatedFiles.length === 0) {
      throw new Error('没有有效的PNG文件')
    }

    // 创建ICNS条目
    const entries: IcnsEntry[] = []

    for (const file of validatedFiles) {
      const size = await getImageSize(file)
      const type = ICNS_TYPES[size]

      if (!type) {
        console.warn(`不支持的图标尺寸: ${size}x${size}`)
        continue
      }

      const data = new Uint8Array(await file.arrayBuffer())
      entries.push({
        type,
        size: data.length + 8, // 数据长度 + 8字节头部
        data,
      })
    }

    if (entries.length === 0) {
      throw new Error('没有支持的图标尺寸')
    }

    // 生成ICNS文件
    const icnsData = generateIcnsFile(entries)
    const blob = new Blob([icnsData], { type: 'image/icns' })

    const generatedFile: GeneratedFile = {
      name: `${filename}.icns`,
      blob,
      size: icnsData.length,
      format: 'icns',
    }

    return {
      platform: 'macos',
      files: [generatedFile],
      success: true,
    }
  }
  catch (error) {
    return {
      platform: 'macos',
      files: [],
      success: false,
      error: error instanceof Error ? error.message : '转换失败',
    }
  }
}
