/**
 * 从源图像生成多尺寸PNG文件
 */
export async function generateMultiSizePngs(sourceImage: File, sizes: number[]): Promise<Map<number, File>> {
  const pngFileMap: Map<number, File> = new Map()

  // 创建图像元素
  const img = new Image()
  const imageUrl = URL.createObjectURL(sourceImage)

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('无法加载源图像'))
    img.src = imageUrl
  })

  const canvas = document.createElement('canvas')
  try {
    for (const size of sizes) {
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('无法创建Canvas上下文')
      }

      canvas.width = size
      canvas.height = size

      // 使用高质量缩放
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 绘制缩放后的图像
      ctx.drawImage(img, 0, 0, size, size)

      // 转换为PNG Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          }
          else {
            reject(new Error(`无法生成${size}x${size}的PNG`))
          }
        }, 'image/png', 1.0)
      })

      // 创建File对象
      const file = new File([blob], `icon_${size}x${size}.png`, {
        type: 'image/png',
      })

      pngFileMap.set(size, file)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  finally {
    URL.revokeObjectURL(imageUrl)
    canvas.remove()
  }

  return pngFileMap
}
