'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Вертикальная карусель сабтайтла Selfray.
 * Идея: СТАТИЧНЫЕ блюр-полосы сверху и снизу слота, центр — чистая зона.
 *  - В покое надпись стоит в центре (вне блюра) → читается чётко.
 *  - На смене старая фраза уезжает ВВЕРХ и заезжает под верхний блюр (там
 *    размывается и исчезает), новая выезжает из-под нижнего блюра в чистый центр.
 * Блюр полос прогрессивный — сходит к 0 к центру, чтобы переход был бесшовный.
 *
 * Web-only (raw DOM + backdrop-filter/mask). Под native — отдельная ветка позже.
 */

const PHRASES = [
  "What's been living in your head lately?",
  'What keeps replaying when it goes quiet?',
  'What are you not saying out loud?',
]

const INTERVAL = 15000 // как часто менять
const FIRST_DELAY = 5000 // первая смена — через 5с от старта
const DUR = 1400 // длительность смены (медленнее → плавнее)
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)' // мягкий ease-out

// Геометрия слота
const TOP = 354 // верх контейнера (чуть ниже тайтла)
const TOPBLUR = 56 // высота верхней блюр-полосы
const CENTER = 84 // чистая центральная зона (2 строки 28/36)
const BOTBLUR = 56 // высота нижней блюр-полосы
const H = TOPBLUR + CENTER + BOTBLUR
const TRAVEL = 96 // вертикальный путь фразы за смену
const BLUR = 12 // сила блюра полос (px)

const textBase: React.CSSProperties = {
  position: 'absolute',
  left: 36, // сжато на 16px по ширине (по 8 с каждой стороны: 28 -> 36)
  right: 36,
  top: TOPBLUR, // надпись сидит в верхней части чистого центра
  height: CENTER,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  textAlign: 'center',
  color: '#FFFFFF',
  fontFamily: 'Lexend, sans-serif',
  fontWeight: 700,
  fontSize: 24,
  lineHeight: '32px',
  letterSpacing: 0,
  willChange: 'transform, opacity',
  transformOrigin: 'center',
  zIndex: 1,
}

const blurBand: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  zIndex: 3, // выше текста — текст проходит ПОД полосой
  pointerEvents: 'none',
  // @ts-ignore — вендорный префикс Safari
  WebkitBackdropFilter: `blur(${BLUR}px)`,
  backdropFilter: `blur(${BLUR}px)`,
}

export function RotatingSubtitle() {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const cur = useRef(0)

  useEffect(() => {
    const advance = () => {
      setPrev(cur.current)
      const next = (cur.current + 1) % PHRASES.length
      cur.current = next
      setI(next)
    }
    let interval: ReturnType<typeof setInterval> | undefined
    // первая смена через FIRST_DELAY, дальше — каждые INTERVAL
    const first = setTimeout(() => {
      advance()
      interval = setInterval(advance, INTERVAL)
    }, FIRST_DELAY)
    return () => {
      clearTimeout(first)
      if (interval) clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (prev === null) return
    const t = setTimeout(() => setPrev(null), DUR)
    return () => clearTimeout(t)
  }, [prev, i])

  return (
    <div
      style={{
        position: 'absolute',
        top: TOP,
        left: 0,
        right: 0,
        height: H,
        zIndex: 2,
        overflow: 'hidden',
        pointerEvents: 'none',
        // мягкие края: контент тает в прозрачность у верха/низа (нет резкой грани, виден фон)
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)',
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* Старая фраза — уезжает вверх под верхний блюр */}
      {prev !== null && (
        <div key={`out-${prev}`} style={{ ...textBase, animation: `selfrayUp ${DUR}ms ${EASE} both` }}>
          {PHRASES[prev]}
        </div>
      )}

      {/* Текущая фраза — в покое чёткая по центру; на смене выезжает снизу из-под блюра */}
      <div
        key={`in-${i}`}
        style={{ ...textBase, animation: prev === null ? undefined : `selfrayInUp ${DUR}ms ${EASE} both` }}
      >
        {PHRASES[i]}
      </div>

      {/* Верхняя статичная блюр-полоса (сильнее у верха, сходит к 0 к центру) */}
      <div
        style={{
          ...blurBand,
          top: 0,
          height: TOPBLUR,
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Нижняя статичная блюр-полоса (сильнее у низа, сходит к 0 к центру) */}
      <div
        style={{
          ...blurBand,
          bottom: 0,
          height: BOTBLUR,
          WebkitMaskImage: 'linear-gradient(to top, #000 0%, #000 35%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to top, #000 0%, #000 35%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  )
}

const KEYFRAMES = `
@keyframes selfrayUp {
  0%   { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-${TRAVEL}px); opacity: 0; }
}
@keyframes selfrayInUp {
  0%   { transform: translateY(${TRAVEL}px) scale(0.7); }
  100% { transform: translateY(0) scale(1); }
}
`
