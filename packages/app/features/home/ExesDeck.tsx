'use client'

import { useRef, useState } from 'react'
import { Text } from '@my/ui'

/**
 * Колода карточек «X-Ray» (конечная — все карты всегда в DOM).
 *  - стек со сдвигом по повороту (0° / +5° / +10°);
 *  - ЛИСТАНИЕ свайпом верхней карты: она улетает вбок с 3D-разворотом (rotateY),
 *    затем на заднем плане (z-index падает) подныривает обратно под колоду;
 *    следующая карта в это время поднимается наверх;
 *  - ТАП по карте/стрелке — открыть (onOpen, экран детали позже);
 * Web-only (pointer events + CSS-анимации).
 */

const CARDS = [
  { title: 'Exes X-Ray', sub: 'The thread running through everyone you’ve loved.' },
  { title: 'Texting X-Ray', sub: 'Read what they actually meant.' },
  { title: 'Burnout X-Ray', sub: 'Find the leak, not just the tiredness.' },
  { title: 'Money X-Ray', sub: 'See the wiring behind your money stress.' },
  { title: 'Purpose X-Ray', sub: 'Trace why ‘stuck’ feels like home.' },
  { title: 'Relationship X-Ray', sub: 'See why the same hurt keeps coming back.' },
]

const W = 294
const H = 388
const SQUIRCLE_D =
  'M 246 0 c 16.802 0 25.202 0 31.62 3.27 a 30 30 0 0 1 13.11 13.11 c 3.27 6.417 3.27 14.818 3.27 31.62 L 294 340 c 0 16.802 0 25.202 -3.27 31.62 a 30 30 0 0 1 -13.11 13.11 c -6.417 3.27 -14.818 3.27 -31.62 3.27 L 48 388 c -16.802 0 -25.202 0 -31.62 -3.27 a 30 30 0 0 1 -13.11 -13.11 c -3.27 -6.417 -3.27 -14.818 -3.27 -31.62 L 0 48 c 0 -16.802 0 -25.202 3.27 -31.62 a 30 30 0 0 1 13.11 -13.11 c 6.417 -3.27 14.818 -3.27 31.62 -3.27 Z'
const SQUIRCLE = `path('${SQUIRCLE_D}')`

const THRESHOLD = 100
const FLY_MS = 660
// мягкая чистая тень 8% — только под двумя ближними картами; под задней тени нет
const SOFT_SHADOW = 'drop-shadow(0px 8px 22px rgba(2,1,10,0.08))'

const rotForDepth = (depth: number) => (depth >= 2 ? 10 : depth === 1 ? 5 : 0)

const DECK_KEYFRAMES = `
@keyframes deckFlyR {
  0%   { transform: translate(0px,0px) rotateY(0deg) rotate(0deg); z-index: 100; }
  45%  { transform: translate(470px,-20px) rotateY(36deg) rotate(15deg); z-index: 100; }
  47%  { transform: translate(455px,-16px) rotateY(34deg) rotate(14deg); z-index: 0; }
  100% { transform: translate(0px,0px) rotateY(0deg) rotate(10deg); z-index: 0; }
}
@keyframes deckFlyL {
  0%   { transform: translate(0px,0px) rotateY(0deg) rotate(0deg); z-index: 100; }
  45%  { transform: translate(-470px,-20px) rotateY(-36deg) rotate(-15deg); z-index: 100; }
  47%  { transform: translate(-455px,-16px) rotateY(-34deg) rotate(-14deg); z-index: 0; }
  100% { transform: translate(0px,0px) rotateY(0deg) rotate(10deg); z-index: 0; }
}
`

export function ExesDeck({ top = 834, left = 54 }: { top?: number; left?: number }) {
  const [order, setOrder] = useState<number[]>(() => CARDS.map((_, i) => i))
  const [drag, setDrag] = useState(0)
  const [flown, setFlown] = useState<{ id: number; dir: number } | null>(null)
  const [pulse, setPulse] = useState(false)
  const dragging = useRef(false)
  const startX = useRef(0)
  const dragX = useRef(0)
  const activeEl = useRef<HTMLDivElement | null>(null) // верхняя карта (для WAAPI-полёта из позиции пальца)

  const leaf = (dir: number) => {
    const topId = order[0]
    const el = activeEl.current
    const f = dir > 0 ? 1 : -1
    // стартуем полёт ИЗ ТЕКУЩЕЙ позиции пальца, иначе CSS-анимация прыгала бы из 0 (баунс назад в колоду)
    const startTf = (el && el.style.transform) || 'translate(0px,0px)'
    setDrag(0)
    setFlown({ id: topId, dir })
    setOrder((o) => [...o.slice(1), o[0]]) // следующая поднимается наверх сразу
    if (el && el.animate) {
      el.animate(
        [
          { transform: startTf, zIndex: 100, offset: 0 },
          { transform: `translate(${f * 470}px,-20px) rotateY(${f * 36}deg) rotate(${f * 15}deg)`, zIndex: 100, offset: 0.45 },
          { transform: `translate(${f * 455}px,-16px) rotateY(${f * 34}deg) rotate(${f * 14}deg)`, zIndex: 0, offset: 0.47 },
          { transform: 'translate(0px,0px) rotateY(0deg) rotate(10deg)', zIndex: 0, offset: 1 },
        ],
        { duration: FLY_MS, easing: 'cubic-bezier(0.4,0,0.35,1)', fill: 'forwards' }
      )
    }
    setTimeout(() => setFlown(null), FLY_MS)
  }
  const open = () => {
    // нажатие теперь даёт press-hold (onDown/onUp), здесь — только действие открытия
    // eslint-disable-next-line no-console
    console.log('open card:', CARDS[order[0]].title)
  }
  const onDown = (e: any) => {
    if (flown) return
    dragging.current = true
    startX.current = e.clientX
    activeEl.current = e.currentTarget
    setPulse(true) // press-feedback (как у Pressable): сжатие на нажатии
  }
  const onMove = (e: any) => {
    if (!dragging.current) return
    dragX.current = e.clientX - startX.current
    setDrag(dragX.current)
  }
  const onUp = () => {
    if (!dragging.current) return
    dragging.current = false
    setPulse(false)
    const d = dragX.current
    dragX.current = 0
    if (Math.abs(d) > THRESHOLD) leaf(d > 0 ? 1 : -1)
    else if (Math.abs(d) < 6) {
      setDrag(0)
      open()
    } else setDrag(0)
  }

  return (
    <div style={{ position: 'absolute', top, left, width: W, height: H, zIndex: 2, perspective: '900px' }}>
      <style>{DECK_KEYFRAMES}</style>
      {CARDS.map((card, id) => {
        const depth = order.indexOf(id)
        const isTop = depth === 0
        const isFlown = !!flown && flown.id === id
        let s: React.CSSProperties
        if (isFlown) {
          // полёт ведёт WAAPI (из позиции пальца) — здесь только конечное состояние под колодой
          s = { transform: 'translate(0px,0px) rotateY(0deg) rotate(10deg)', zIndex: 0 }
        } else if (isTop) {
          if (drag !== 0) {
            s = {
              transform: `translateX(${drag}px) rotateY(${drag * 0.1}deg) rotate(${drag * 0.04}deg)`,
              transition: dragging.current ? 'none' : 'transform 320ms cubic-bezier(0.34,1.2,0.64,1)',
              zIndex: 50,
            }
          } else {
            s = { transform: `scale(${pulse ? 0.96 : 1})`, transition: 'transform 150ms ease', zIndex: 50 }
          }
        } else {
          s = {
            transform: `rotate(${rotForDepth(depth)}deg)`,
            transition: 'transform 360ms ease, opacity 360ms ease',
            zIndex: 50 - depth,
            opacity: depth > 2 ? 0 : 1, // глубже 3-го прячем (это «дно» колоды)
          }
        }
        return (
          <div
            key={id}
            onPointerDown={isTop && !isFlown ? onDown : undefined}
            onPointerMove={isTop && !isFlown ? onMove : undefined}
            onPointerUp={isTop && !isFlown ? onUp : undefined}
            onPointerCancel={isTop && !isFlown ? onUp : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              width: W,
              height: H,
              transformOrigin: 'center',
              cursor: isTop && !isFlown ? 'grab' : 'default',
              touchAction: 'pan-y',
              ...s,
            }}
          >
            <CardVisual title={card.title} sub={card.sub} shadow={depth <= 1 ? SOFT_SHADOW : 'none'} tappable={isTop} />
          </div>
        )
      })}

      {/* Каунтер под колодой — 24px от карточки (388 + 24 = 412), Hanken Grotesk 17/22, по центру */}
      <Text
        fontFamily="$body"
        fontWeight="500"
        fontSize={15}
        lineHeight={20}
        letterSpacing={0}
        color="rgba(255,255,255,0.9)"
        textAlign="center"
        // @ts-ignore
        style={{ position: 'absolute', top: 412, left: 0, right: 0, zIndex: 1 }}
      >
        {order[0] + 1} of {CARDS.length}
      </Text>
    </div>
  )
}

function CardVisual({ title, sub, shadow, tappable }: { title: string; sub: string; shadow: string; tappable?: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* бекдроп-блюр (вне filter-обёртки, иначе backdrop-filter ломается) — размывает то, что
          под картой (соседняя карта/градиент), чтобы сквозь зафейженную иллюстрацию читалось матовое стекло */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: SQUIRCLE,
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)',
        }}
      />
      {/* тень на НЕобрезанной обёртке — иначе clip-path срезает свой же drop-shadow */}
      <div style={{ position: 'absolute', inset: 0, filter: shadow }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: SQUIRCLE }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.14)' }} />
        <img
          src="/illustration.png"
          width={W}
          height={H}
          alt=""
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88 }}
        />
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="deckBorderGrad" x1="0" y1="0" x2={W} y2={H} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
          </defs>
          <path d={SQUIRCLE_D} stroke="url(#deckBorderGrad)" strokeWidth={2} fill="none" />
        </svg>
        <Text
          fontFamily="$heading"
          fontWeight="900"
          fontSize={22}
          lineHeight={28}
          letterSpacing={0}
          color="#41474F"
          // @ts-ignore
          style={{ position: 'absolute', top: 28, left: 20, right: 20 }}
        >
          {title}
        </Text>
        <Text
          fontFamily="$body"
          fontWeight="500"
          fontSize={17}
          lineHeight={22}
          letterSpacing={0}
          color="#41474F"
          // @ts-ignore
          style={{ position: 'absolute', top: 62, left: 20, right: 20 }}
        >
          {sub}
        </Text>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: 'rgba(255,255,255,0.01)',
          WebkitBackdropFilter: 'blur(37px)',
          backdropFilter: 'blur(37px)',
          boxShadow: '0px 4px 24px rgba(2,1,10,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: tappable ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            padding: 1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }}
        />
        <img src="/arrow.svg" width={44} height={44} alt="" draggable={false} style={{ width: 44, height: 44 }} />
      </div>
    </div>
  )
}
