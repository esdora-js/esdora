import { describe, expect, it } from 'vitest'
import { clsx, cn, cva, twJoin, twMerge } from './index'

describe('cn', () => {
  describe('基础功能', () => {
    it('应该合并单个字符串类名', () => {
      expect(cn('foo')).toBe('foo')
      expect(cn('foo bar')).toBe('foo bar')
    })

    it('应该合并多个字符串类名', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
    })

    it('应该处理数组类名', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
      expect(cn(['foo'], ['bar', 'baz'])).toBe('foo bar baz')
    })

    it('应该处理对象类名', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo')
      expect(cn({ foo: true, bar: true })).toBe('foo bar')
    })

    it('应该处理条件类名', () => {
      const isActive = true
      const isDisabled = false
      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
    })

    it('应该处理混合类型输入', () => {
      expect(cn('foo', ['bar'], { baz: true }, false, 'qux')).toBe('foo bar baz qux')
    })
  })

  describe('类名合并', () => {
    it('应该解决 Tailwind CSS 类名冲突（相同属性）', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('text-sm', 'text-lg')).toBe('text-lg')
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('应该保留不冲突的 Tailwind CSS 类名', () => {
      expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
      expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
    })

    it('应该处理响应式类名', () => {
      expect(cn('px-2', 'md:px-4')).toBe('px-2 md:px-4')
      expect(cn('text-sm', 'lg:text-lg')).toBe('text-sm lg:text-lg')
    })

    it('应该处理伪类', () => {
      expect(cn('text-black', 'hover:text-blue-500')).toBe('text-black hover:text-blue-500')
      expect(cn('bg-white', 'focus:bg-gray-100')).toBe('bg-white focus:bg-gray-100')
    })

    it('应该处理复杂的 Tailwind CSS 场景', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
      expect(cn('text-sm font-normal', 'text-lg')).toBe('font-normal text-lg')
    })
  })

  describe('边界情况', () => {
    it('应该处理空输入', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })

    it('应该处理 undefined 和 null', () => {
      expect(cn(undefined)).toBe('')
      expect(cn(null)).toBe('')
      expect(cn('foo', undefined, 'bar', null)).toBe('foo bar')
    })

    it('应该处理空数组', () => {
      expect(cn([])).toBe('')
      expect(cn([], [])).toBe('')
      expect(cn('foo', [], 'bar')).toBe('foo bar')
    })

    it('应该处理空对象', () => {
      expect(cn({})).toBe('')
      expect(cn({}, {})).toBe('')
      expect(cn('foo', {}, 'bar')).toBe('foo bar')
    })

    it('应该处理所有值为 false 的对象', () => {
      expect(cn({ foo: false, bar: false })).toBe('')
    })

    it('应该处理嵌套数组', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })

    it('应该处理重复的类名', () => {
      // clsx 不会自动去重非 Tailwind 类名
      expect(cn('foo', 'foo')).toBe('foo foo')
      expect(cn('foo bar', 'bar baz')).toBe('foo bar bar baz')
    })
  })
})

describe('重新导出', () => {
  describe('class-variance-authority', () => {
    it('应该能够导入 cva 函数', () => {
      expect(typeof cva).toBe('function')
    })

    it('应该能够使用 cva 创建变体', () => {
      const button = cva('base-button', {
        variants: {
          intent: {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
          },
          size: {
            small: 'btn-sm',
            large: 'btn-lg',
          },
        },
      })

      expect(button({ intent: 'primary', size: 'small' })).toBe('base-button btn-primary btn-sm')
      expect(button({ intent: 'secondary', size: 'large' })).toBe('base-button btn-secondary btn-lg')
    })

    it('应该处理默认变体', () => {
      const button = cva('base-button', {
        variants: {
          intent: {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
          },
        },
        defaultVariants: {
          intent: 'primary',
        },
      })

      expect(button()).toBe('base-button btn-primary')
    })
  })

  describe('clsx 命名空间', () => {
    it('应该能够访问 clsx.clsx 函数', () => {
      expect(typeof clsx.clsx).toBe('function')
    })

    it('应该能够使用 clsx.clsx 合并类名', () => {
      expect(clsx.clsx('foo', 'bar')).toBe('foo bar')
      expect(clsx.clsx({ foo: true, bar: false })).toBe('foo')
    })

    it('应该能够访问 clsx.ClassValue 类型', () => {
      // TypeScript 类型检查 - 运行时验证类型存在性
      const classValue: clsx.ClassValue = 'foo'
      expect(typeof classValue).toBe('string')
    })
  })

  describe('tailwind-merge', () => {
    it('应该能够导入 twMerge 函数', () => {
      expect(typeof twMerge).toBe('function')
    })

    it('应该能够使用 twMerge 合并 Tailwind 类名', () => {
      expect(twMerge('px-2', 'px-4')).toBe('px-4')
      expect(twMerge('text-sm', 'text-lg')).toBe('text-lg')
    })

    it('应该能够导入 twJoin 函数', () => {
      expect(typeof twJoin).toBe('function')
    })

    it('应该能够使用 twJoin 连接类名', () => {
      expect(twJoin('foo', 'bar')).toBe('foo bar')
      expect(twJoin('foo', undefined, 'bar')).toBe('foo bar')
    })
  })
})
