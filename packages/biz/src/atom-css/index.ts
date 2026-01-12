import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export * from 'class-variance-authority'
export * as clsx from 'clsx'
export * from 'tailwind-merge'

/**
 * 合并类名 该方法是对 clsx 与 twMerge 的封装
 * @param inputs 原子类样式名
 * @returns 合并后的类名
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
