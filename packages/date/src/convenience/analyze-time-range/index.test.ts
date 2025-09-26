import { describe, expect, it } from 'vitest'
import { analyzeTimeRange } from '.'

// 描述测试的顶级目标
describe('analyzeTimeRange 函数', () => {
  // === 分区 1: 核心功能测试 (Core Functionality Tests) ===
  describe('当输入均为有效且逻辑正确的日期时', () => {
    const startTime = '2024-10-10T10:00:00.000Z'
    const endTime = '2024-10-20T10:00:00.000Z'

    it('当目标时间在区间之前时, 必须返回 "before" 状态和正确的正数差值', () => {
      const targetTime = '2024-10-09T10:00:00.000Z'
      const result = analyzeTimeRange(targetTime, startTime, endTime)
      const expectedDistance = new Date(startTime).getTime() - new Date(targetTime).getTime()

      expect(result).toEqual({
        status: 'before',
        distance: expectedDistance,
      })
    })

    it('当目标时间在区间之内时, 必须返回 "inRange" 状态和 0 差值', () => {
      const targetTime = '2024-10-15T10:00:00.000Z'
      const result = analyzeTimeRange(targetTime, startTime, endTime)

      expect(result).toEqual({
        status: 'inRange',
        distance: 0,
      })
    })

    it('当目标时间在区间之后时, 必须返回 "after" 状态和正确的正数差值', () => {
      const targetTime = '2024-10-21T10:00:00.000Z'
      const result = analyzeTimeRange(targetTime, startTime, endTime)
      const expectedDistance = new Date(targetTime).getTime() - new Date(endTime).getTime()

      expect(result).toEqual({
        status: 'after',
        distance: expectedDistance,
      })
    })
  })

  // === 分区 2: 边界值与临界点测试 (Boundary and Edge Case Tests) ===
  describe('当目标时间恰好在区间的临界点时', () => {
    const startTime = '2024-10-10T10:00:00.000Z'
    const endTime = '2024-10-20T10:00:00.000Z'

    it('当目标时间与开始时间完全相同时, 必须返回 "inRange" 状态', () => {
      const result = analyzeTimeRange(startTime, startTime, endTime)
      expect(result).toEqual({ status: 'inRange', distance: 0 })
    })

    it('当目标时间与结束时间完全相同时, 必须返回 "inRange" 状态', () => {
      const result = analyzeTimeRange(endTime, startTime, endTime)
      expect(result).toEqual({ status: 'inRange', distance: 0 })
    })
  })

  // === 分区 3: 无效输入与错误处理测试 (Invalid Input & Error Handling Tests) ===
  describe('当输入包含无效逻辑或无效日期时', () => {
    const validTime = '2024-01-01'
    const validStart = '2024-01-10'
    const validEnd = '2024-01-20'

    it('当开始时间晚于结束时间时, 必须返回 null', () => {
      expect(analyzeTimeRange(validTime, validEnd, validStart)).toBeNull()
    })

    it('当目标时间是无效日期字符串时, 必须返回 null', () => {
      expect(analyzeTimeRange('not-a-date', validStart, validEnd)).toBeNull()
    })

    it('当开始时间是无效日期字符串时, 必须返回 null', () => {
      expect(analyzeTimeRange(validTime, 'not-a-date', validEnd)).toBeNull()
    })

    it('当结束时间是无效日期字符串时, 必须返回 null', () => {
      expect(analyzeTimeRange(validTime, validStart, 'not-a-date')).toBeNull()
    })

    it('当任意时间是 Invalid Date 对象时, 必须返回 null', () => {
      expect(analyzeTimeRange(new Date('invalid'), validStart, validEnd)).toBeNull()
    })
  })

  // === 分区 4: 输入格式兼容性测试 (Input Format Compatibility Tests) ===
  describe('当输入为不同但合法的日期格式时', () => {
    const startDate = new Date('2024-10-10T10:00:00.000Z')
    const endDate = new Date('2024-10-20T10:00:00.000Z')

    it('当所有输入均为 Date 对象时, 必须能正确计算', () => {
      const targetDate = new Date('2024-10-15T10:00:00.000Z')
      expect(analyzeTimeRange(targetDate, startDate, endDate)).toEqual({ status: 'inRange', distance: 0 })
    })

    it('当所有输入均为毫秒数时间戳时, 必须能正确计算', () => {
      const targetTimestamp = startDate.getTime() - 1000
      const expectedDistance = startDate.getTime() - targetTimestamp
      expect(analyzeTimeRange(targetTimestamp, startDate.getTime(), endDate.getTime())).toEqual({ status: 'before', distance: expectedDistance })
    })

    it('当输入为字符串、Date对象和时间戳的混合时, 必须能正确计算', () => {
      const mixTarget = '2024-10-25T10:00:00.000Z'
      const expectedDistance = new Date(mixTarget).getTime() - endDate.getTime()
      expect(analyzeTimeRange(mixTarget, startDate, endDate.getTime())).toEqual({ status: 'after', distance: expectedDistance })
    })
  })

  // === 分区 5: 复杂输入格式健壮性测试 (Robustness Tests for Complex Input Formats) ===
  describe('当输入为各种复杂且混合的日期格式时', () => {
    // 为了测试确定性，我们使用 UTC 来定义基准，避免时区问题
    const startTimeStr = '2025-02-02T12:00:00.000Z'
    const endTimeStr = '2025-02-12T12:00:00.000Z'

    it('当输入包含 "YYYY-MM-DD" 格式的字符串时, 必须能正确解析并判断', () => {
      // date-fns 会将 '2025-02-07' 解析为 UTC 时间的 '2025-02-07T00:00:00.000Z'
      const targetDateOnly = '2025-02-07'

      const result = analyzeTimeRange(targetDateOnly, startTimeStr, endTimeStr)
      expect(result).toEqual({ status: 'inRange', distance: 0 })
    })

    it('当输入包含 "YYYY-MM-DD HH:mm:ss" 格式的字符串时, 必须能正确解析并判断', () => {
      // 注意: ISO 8601 推荐用 'T' 分隔，但很多场景用空格，date-fns 兼容此格式
      const targetWithTime = '2025-02-15 12:00:00'

      const result = analyzeTimeRange(targetWithTime, startTimeStr, endTimeStr)
      const expectedDistance = new Date(targetWithTime).getTime() - new Date(endTimeStr).getTime()

      expect(result).toEqual({ status: 'after', distance: expectedDistance })
    })

    it('当输入包含 Date.now() 或其他毫秒级时间戳时, 必须能正确判断', () => {
      // 我们在测试时动态获取，以模拟真实场景
      const now = Date.now()
      const start = now - 10000 // 10 秒前
      const end = now + 10000 // 10 秒后

      const result = analyzeTimeRange(now, start, end)
      expect(result).toEqual({ status: 'inRange', distance: 0 })
    })

    it('当输入是 Date 对象、时间戳和多种字符串格式的疯狂混合时, 必须依然保持健壮', () => {
      const startTimeAsDate = new Date('2025-03-01T00:00:00.000Z')
      const endTimeAsTimestamp = new Date('2025-03-10T23:59:59.999Z').getTime()

      // 目标时间是一个不带时区的日期+时间字符串
      const targetTimeMixed = '2025-02-28 23:59:59'

      const result = analyzeTimeRange(targetTimeMixed, startTimeAsDate, endTimeAsTimestamp)
      const expectedDistance = startTimeAsDate.getTime() - new Date(targetTimeMixed).getTime()

      expect(result).toEqual({
        status: 'before',
        distance: expectedDistance,
      })
    })
  })
})
