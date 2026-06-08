import { createFont } from 'tamagui'

/**
 * Типографика Selfray.
 *  - Заголовки: Lexend
 *  - Текст:     Hanken Grotesk
 * Сами файлы шрифтов грузятся в вебе через Google Fonts <link> (см. apps/next/app/layout.tsx).
 * Роли легко поменять местами — просто переставь family ниже.
 */

const HEADING_FAMILY =
  'Lexend, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif'
const BODY_FAMILY =
  '"Hanken Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif'

// Общая шкала размеров (токены 1..16)
const size = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 124,
} as const

// line-height чуть больше размера; для крупных кеглей — плотнее
const buildLineHeight = (factor: number) =>
  Object.fromEntries(
    Object.entries(size).map(([k, v]) => [k, Math.round(v * factor)])
  ) as Record<string, number>

const weight = {
  1: '300',
  4: '400',
  5: '500',
  6: '500',
  7: '600',
  8: '700',
  9: '800',
  10: '800',
} as const

const letterSpacing = {
  5: 1,
  6: 0,
  7: 0,
  8: -0.5,
  9: -1,
  10: -1.5,
  12: -2,
  14: -3,
  15: -4,
} as const

// face — имена начертаний для нативной сборки (на вебе используется family)
const headingFace = {
  300: { normal: 'Lexend' },
  400: { normal: 'Lexend' },
  500: { normal: 'Lexend' },
  600: { normal: 'Lexend' },
  700: { normal: 'Lexend' },
  800: { normal: 'Lexend' },
}
const bodyFace = {
  300: { normal: 'Hanken Grotesk' },
  400: { normal: 'Hanken Grotesk' },
  500: { normal: 'Hanken Grotesk' },
  600: { normal: 'Hanken Grotesk' },
  700: { normal: 'Hanken Grotesk' },
  800: { normal: 'Hanken Grotesk' },
}

export const headingFont = createFont({
  family: HEADING_FAMILY,
  size,
  lineHeight: buildLineHeight(1.1),
  weight,
  letterSpacing,
  face: headingFace,
})

export const bodyFont = createFont({
  family: BODY_FAMILY,
  size,
  lineHeight: buildLineHeight(1.25),
  weight,
  letterSpacing,
  face: bodyFace,
})
