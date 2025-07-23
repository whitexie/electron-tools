// 工具函数统一导出

export * from './file-utils'
export * from './image-utils'
export * from './platform-utils'

/**
 * 对数组去重复
 * @param array 需要去重的数组
 * @returns 去重后的数组
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}
