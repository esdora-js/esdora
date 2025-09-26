import { differenceInMilliseconds, isValid, isWithinInterval, toDate } from 'date-fns'

// 允许输入类型别名
type DateInput = string | number | Date

// 定义清晰、强类型的返回对象
interface TimeRangeAnalysis {
  status: 'before' | 'inRange' | 'after'
  distance: number // 差值，单位为毫秒 (ms)
}

/**
 * @param time 要分析的目标时间点
 * @param startTime 区间开始时间
 * @param endTime 区间结束时间
 * @returns 一个包含分析结果的对象，或在输入无效时返回 null
 */
export function analyzeTimeRange(time: DateInput, startTime: DateInput, endTime: DateInput): TimeRangeAnalysis | null {
  // 1. 将所有输入转换为内部 Date 对象
  const timeDate = toDate(time)
  const startDate = toDate(startTime)
  const endDate = toDate(endTime)

  // 2. 验证用户输入是否有效
  // 如果任何一个日期无效，或者时间区间本身不成立，则返回 null
  if (!isValid(timeDate) || !isValid(startDate) || !isValid(endDate) || startDate > endDate) {
    return null
  }

  // 3. 核心逻辑判断
  // 3.1. 判断是否在区间内
  if (isWithinInterval(timeDate, { start: startDate, end: endDate })) {
    return { status: 'inRange', distance: 0 }
  }

  // 3.2. 判断是否在区间之前
  if (timeDate < startDate) {
    const diff = differenceInMilliseconds(startDate, timeDate)
    return { status: 'before', distance: diff }
  }

  // 3.3. 判断是否在区间之后 (必然)
  const diff = differenceInMilliseconds(timeDate, endDate)
  return { status: 'after', distance: diff }
}
