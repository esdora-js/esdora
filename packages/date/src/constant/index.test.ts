import { format } from 'date-fns'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { DATE_FORMAT } from '.'

// 这些常量最终都会喂给 date-fns 的 format，因此用 date-fns 自身作为真值
// 来校验：每个常量都必须能被正确解析并产出预期值。
// 锁定时区为 UTC，避免 CI/本地时区差异导致断言失败（Node 会读取 process.env.TZ）。

const ORIGINAL_TZ = process.env.TZ

beforeAll(() => {
  process.env.TZ = 'UTC'
})

afterAll(() => {
  process.env.TZ = ORIGINAL_TZ
})

// 选用一个刻意覆盖边界与闰年的参考时间：
// - 2024 是闰年，2 月 29 日真实存在
// - 单位字段刻意取不同值，便于一眼区分「把年写成月」「把分钟写成月」等错位 bug
//   年=2024 月=02 日=29 时=03 分=04 秒=05
const REFERENCE_DATE = new Date('2024-02-29T03:04:05.000Z')

// 用 date-fns 是否抛错来判定「误写值不可接受」：抛错时返回 null
// catch 单独成行以符合仓库的 brace-style 约定（见 kit 包测试）
function tryFormat(date: Date, formatStr: string): string | null {
  try {
    return format(date, formatStr)
  }
  catch {
    return null
  }
}

describe('date_format 常量', () => {
  // === 分区 1: 单位格式常量 (Single-unit format constants) ===
  describe('当使用单位格式常量时', () => {
    it('常量 YEAR 必须能正确格式化年份', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.YEAR)).toBe('2024')
    })

    it('常量 MONTH 必须能正确格式化月份', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.MONTH)).toBe('02')
    })

    it('常量 DAY 必须能正确格式化日期', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.DAY)).toBe('29')
    })

    it('常量 HOUR 必须能正确格式化小时 (24 小时制)', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.HOUR)).toBe('03')
    })

    it('常量 MINUTE 必须能正确格式化分钟', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.MINUTE)).toBe('04')
    })

    it('常量 SECOND 必须能正确格式化秒', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.SECOND)).toBe('05')
    })
  })

  // === 分区 2: 时间区间复合常量 (Time-span composite constants) ===
  describe('当使用时间区间复合常量时', () => {
    it('复合 HH_MM 必须能正确格式化小时和分钟', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.HH_MM)).toBe('03:04')
    })

    it('复合 HH_MM_SS 必须能正确格式化小时、分钟和秒', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.HH_MM_SS)).toBe('03:04:05')
    })
  })

  // === 分区 3: 日期区间复合常量 (Date-span composite constants) ===
  describe('当使用日期区间复合常量时', () => {
    it('复合 YYYY_MM_DD 必须能正确格式化年、月、日', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.YYYY_MM_DD)).toBe('2024-02-29')
    })

    it('复合 YYYY_MM_DD_HH_MM 必须能正确格式化到分钟', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.YYYY_MM_DD_HH_MM)).toBe('2024-02-29 03:04')
    })

    it('复合 YYYY_MM_DD_HH_MM_SS 必须能正确格式化到秒', () => {
      expect(format(REFERENCE_DATE, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe('2024-02-29 03:04:05')
    })
  })

  // === 分区 4: 防误写 token 护栏 (Guardrails against mis-cased / mis-named tokens) ===
  // 常量值极易拼错（如 yyyy→YYYY、dd→DD）。date-fns 对 Unicode token 的大小写极其
  // 敏感：大写版本要么直接抛错，要么含义完全不同（YYYY 是「周年所在年」，DD 是「年中第几天」，
  // 不是年/日）。这里把「正确的单位 token」逐一钉死：当前值必须产出真值，而常见的误写值
  // 必须不可接受（抛错）或产出不同结果，从而在常量被改错时立即失败。
  describe('当防护「单位 token 被误写为错误大小写或错误名字」时', () => {
    // [常量名, 当前正确 token, 容易误写成的错误 token, 用参考时间格式化应得到的真值]
    const cases = [
      // YYYY 是 date-fns 明确拒绝的「Unicode 误用」token，会直接抛错
      { name: 'YEAR', correct: DATE_FORMAT.YEAR, wrong: 'YYYY', expected: '2024' },
      // 小写的 m/M、s/S 含义与「月/秒」不同：MM 是月，mm 才是分钟；ss 是秒，SS 是秒的小数
      { name: 'MONTH', correct: DATE_FORMAT.MONTH, wrong: 'mm', expected: '02' },
      // DD 是 date-fns 明确拒绝的误用 token（应为 dd）
      { name: 'DAY', correct: DATE_FORMAT.DAY, wrong: 'DD', expected: '29' },
      // HH 是 24 小时制；把「小时」常量误写成「分钟」mm 会导致语义错位
      { name: 'HOUR', correct: DATE_FORMAT.HOUR, wrong: 'mm', expected: '03' },
      // mm 是分钟；误写成 MM 会变成「月份」，产出完全不同的值
      { name: 'MINUTE', correct: DATE_FORMAT.MINUTE, wrong: 'MM', expected: '04' },
      // ss 是秒；误写成 SS 会变成「秒的小数部分」，产出完全不同的值
      { name: 'SECOND', correct: DATE_FORMAT.SECOND, wrong: 'SS', expected: '05' },
    ] as const

    for (const { name, correct, wrong, expected } of cases) {
      it(`护栏 ${name} 必须产出真值「${expected}」，且误写值「${wrong}」不可接受`, () => {
        // 1) 当前常量值必须能被 date-fns 正确格式化为真值
        expect(format(REFERENCE_DATE, correct)).toBe(expected)

        // 2) 误写后的值必须「不可接受」：要么 date-fns 直接抛错，要么产出与真值不同的结果。
        //    若两者相同，说明该误写值无法起到护栏作用，需要换一个更强的误写样例。
        const wrongResult = tryFormat(REFERENCE_DATE, wrong)

        // 误写值要么抛错（result 为 null），要么结果与真值不同 —— 二者至少满足其一
        const guardHolds = wrongResult === null || wrongResult !== expected
        expect(guardHolds, `误写值「${wrong}」既未被 date-fns 拒绝，又产出了与真值相同的结果「${expected}」，护栏失效`).toBe(true)
      })
    }
  })

  // === 分区 5: 跨库 token 风格护栏 (Cross-library token style guardrails) ===
  // date-fns 与 dayjs/moment 的格式 token 大小写语义完全不同，且不可互换：
  //   - dayjs/moment 默认转换，甚至静默错位（如 `YYYY-mm-DD` 会被 dayjs 当成「年-月-日」，
  //     其中 `mm` 被错误地解释为月份而非分钟，产出 04 而非真实的分钟）。
  //   - date-fns 严格遵循 Unicode Technical Standard #35，对大写 `YYYY`/`DD` 等 token
  //     直接抛错（YYYY 是「周年所在年」，DD 是「年中第几天」，与直觉相悖）。
  // 因此这套常量必须使用 date-fns 的 yyyy/MM/dd 风格。这里把「dayjs 风格的等价字符串」
  // 逐一钉死：它们在 date-fns 下必须被拒绝（抛错），防止有人照 dayjs 习惯改写常量值。
  describe('当防护「常量值被误写成 dayjs/moment 风格的大写 token」时', () => {
    // 对照表：常量 => 容易被 dayjs 用户误用的「等价」写法（均为大写 YYYY/DD 风格）
    // 这些字符串在 dayjs 下都能正常工作，但在 date-fns 下必须抛错。
    const dayjsStyleCases = [
      { name: 'YYYY_MM_DD', value: DATE_FORMAT.YYYY_MM_DD, dayjsStyle: 'YYYY-MM-DD' },
      { name: 'YYYY_MM_DD_HH_MM', value: DATE_FORMAT.YYYY_MM_DD_HH_MM, dayjsStyle: 'YYYY-MM-DD HH:mm' },
      { name: 'YYYY_MM_DD_HH_MM_SS', value: DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, dayjsStyle: 'YYYY-MM-DD HH:mm:ss' },
      // 用户特别提到的陷阱：YYYY-mm-DD —— dayjs 会静默把 mm 当月份，date-fns 必须拒绝
      { name: 'YYYY_MM_DD (mm 陷阱)', value: DATE_FORMAT.YYYY_MM_DD, dayjsStyle: 'YYYY-mm-DD' },
      // DD/MM/YYYY：dayjs 当「日/月/年」，date-fns 拒绝大写 DD
      { name: 'YYYY_MM_DD (DD 陷阱)', value: DATE_FORMAT.YYYY_MM_DD, dayjsStyle: 'DD/MM/YYYY' },
    ] as const

    for (const { name, value, dayjsStyle } of dayjsStyleCases) {
      it(`跨库护栏 ${name}：dayjs 风格「${dayjsStyle}」在 date-fns 下必须抛错`, () => {
        // 1) 当前常量值（date-fns 风格）必须能正常工作
        expect(tryFormat(REFERENCE_DATE, value)).not.toBeNull()

        // 2) dayjs 风格的等价写法在 date-fns 下必须被拒绝
        expect(tryFormat(REFERENCE_DATE, dayjsStyle), `dayjs 风格「${dayjsStyle}」未被 date-fns 拒绝，存在跨库误用风险`).toBeNull()
      })
    }
  })
})
