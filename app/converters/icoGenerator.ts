import type { ConversionResult, GeneratedFile } from '~/types/services'

interface IcoEntry {
  width: number
  height: number
  colorCount: number
  reserved: number
  planes: number
  bitCount: number
  bytesInRes: number
  imageOffset: number
  imageData: Uint8Array
}

/**
 * 将PNG文件数组转换为ICO格式
 * @param pngFileMapping - PNG文件数组，每个文件应该是不同尺寸的图标
 * @param filename - 输出文件名（不含扩展名）
 * @returns 转换结果
 */
export async function convertPngFilesToIco(
  pngFileMapping: Record<number, File>,
  filename: string = 'icon',
): Promise<ConversionResult> {
  try {
    const validatedFiles = pngFileMapping
    if (Object.keys(validatedFiles).length === 0) {
      throw new Error('没有有效的PNG文件')
    }

    // 创建ICO条目
    const entries: IcoEntry[] = []

    for (const [key, file] of Object.entries(validatedFiles)) {
      const size = Number(key)

      // 验证文件是否为有效的PNG
      const imageData = new Uint8Array(await file.arrayBuffer())

      // 检查PNG文件头
      if (imageData.length < 8
        || imageData[0] !== 0x89 || imageData[1] !== 0x50
        || imageData[2] !== 0x4E || imageData[3] !== 0x47) {
        console.warn(`文件 ${file.name} 不是有效的PNG格式`)
        continue
      }

      entries.push({
        width: size === 256 ? 0 : size, // ICO格式中256用0表示
        height: size === 256 ? 0 : size,
        colorCount: 0, // PNG格式使用0
        reserved: 0,
        planes: 1,
        bitCount: 32, // 32位RGBA
        bytesInRes: imageData.length,
        imageOffset: 0, // 稍后计算
        imageData,
      })
    }

    if (entries.length === 0) {
      throw new Error('没有支持的图标尺寸')
    }

    // 按尺寸排序（小到大）
    entries.sort((a, b) => {
      const sizeA = a.width === 0 ? 256 : a.width
      const sizeB = b.width === 0 ? 256 : b.width
      return sizeA - sizeB
    })

    // 生成ICO文件
    const icoData = generateIcoFile(entries)

    // 验证生成的ICO文件
    if (!validateIcoFile(icoData)) {
      throw new Error('生成的ICO文件格式无效')
    }

    const blob = new Blob([icoData], { type: 'image/x-icon' })

    const generatedFile: GeneratedFile = {
      name: `${filename}.ico`,
      blob,
      size: icoData.length,
      format: 'ico',
      dimensions: `${entries.length} sizes`,
    }

    return {
      platform: 'windows',
      files: [generatedFile],
      success: true,
    }
  }
  catch (error) {
    return {
      platform: 'windows',
      files: [],
      success: false,
      error: error instanceof Error ? error.message : '转换失败',
    }
  }
}

/**
 * 生成ICO文件二进制数据
 * 按照Microsoft ICO格式规范组装数据
 */
function generateIcoFile(entries: IcoEntry[]): Uint8Array {
  // 计算文件头大小
  const headerSize = 6 // ICO文件头
  const directorySize = entries.length * 16 // 每个条目16字节
  const headerAndDirectorySize = headerSize + directorySize

  // 计算每个条目的偏移量
  let currentOffset = headerAndDirectorySize
  for (const entry of entries) {
    entry.imageOffset = currentOffset
    currentOffset += entry.bytesInRes
  }

  // 计算总文件大小
  const totalSize = currentOffset

  // 创建输出缓冲区
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const uint8View = new Uint8Array(buffer)

  let offset = 0

  // 写入ICO文件头 (6字节) - 使用小端序
  view.setUint16(offset, 0, true) // Reserved (必须为0)
  offset += 2
  view.setUint16(offset, 1, true) // Type (1 = ICO)
  offset += 2
  view.setUint16(offset, entries.length, true) // 图标数量
  offset += 2

  // 写入图标目录条目 (每个16字节)
  for (const entry of entries) {
    // 宽度和高度：256像素用0表示，其他直接使用实际值
    const width = entry.width === 0 ? 0 : entry.width
    const height = entry.height === 0 ? 0 : entry.height

    view.setUint8(offset, width) // 宽度
    offset += 1
    view.setUint8(offset, height) // 高度
    offset += 1
    view.setUint8(offset, 0) // 颜色数量 (PNG格式使用0)
    offset += 1
    view.setUint8(offset, 0) // 保留字段 (必须为0)
    offset += 1
    view.setUint16(offset, 1, true) // 颜色平面数 (必须为1)
    offset += 2
    view.setUint16(offset, 32, true) // 每像素位数 (PNG通常是32位)
    offset += 2
    view.setUint32(offset, entry.bytesInRes, true) // 图像数据大小
    offset += 4
    view.setUint32(offset, entry.imageOffset, true) // 图像数据偏移
    offset += 4
  }

  // 写入图像数据
  for (const entry of entries) {
    uint8View.set(entry.imageData, entry.imageOffset)
  }

  return uint8View
}

/**
 * 验证ICO文件的基本结构
 * @param icoData ICO文件数据
 * @returns 验证结果
 */
function validateIcoFile(icoData: Uint8Array): boolean {
  if (icoData.length < 6)
    return false

  const view = new DataView(icoData.buffer)

  // 检查文件头
  const reserved = view.getUint16(0, true)
  const type = view.getUint16(2, true)
  const count = view.getUint16(4, true)

  if (reserved !== 0 || type !== 1 || count === 0) {
    return false
  }

  // 检查是否有足够的空间存放目录条目
  if (icoData.length < 6 + count * 16) {
    return false
  }

  return true
}
