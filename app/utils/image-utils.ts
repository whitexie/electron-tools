/**
 * 获取图像尺寸
 */
export async function getImageSize(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      // 假设图标是正方形，返回宽度
      const size = img.width
      img.remove()
      resolve(size)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      img.remove()
      reject(new Error('无法加载图像'))
    }

    img.src = url
  })
}
