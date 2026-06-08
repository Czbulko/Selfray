'use client'

import { useEffect, useRef, useState } from 'react'
import { Text, YStack } from '@my/ui'
import { RotatingSubtitle } from './RotatingSubtitle'
import { ExesDeck } from './ExesDeck'

// Исходный фон 804×5122 = @2× → дизайн-ширина 402. Держим колонку этой ширины.
const DESIGN_WIDTH = 402

// iOS-squircle путь карточки CTA (figma-squircle: радиус 30, сглаживание 60%, размер 346×98).
const CTA_SQUIRCLE_D =
  "M 298 0 c 16.802 0 25.202 0 31.62 3.27 a 30 30 0 0 1 13.11 13.11 c 3.27 6.417 3.27 14.818 3.27 31.62 L 346 50 c 0 16.802 0 25.202 -3.27 31.62 a 30 30 0 0 1 -13.11 13.11 c -6.417 3.27 -14.818 3.27 -31.62 3.27 L 48 98 c -16.802 0 -25.202 0 -31.62 -3.27 a 30 30 0 0 1 -13.11 -13.11 c -3.27 -6.417 -3.27 -14.818 -3.27 -31.62 L 0 48 c 0 -16.802 0 -25.202 3.27 -31.62 a 30 30 0 0 1 13.11 -13.11 c 6.417 -3.27 14.818 -3.27 31.62 -3.27 Z"
const CTA_SQUIRCLE = `path('${CTA_SQUIRCLE_D}')`

// Карточка под секцией: тот же iOS-squircle (радиус 30, сглаживание 60%), размер 294×388.
const CARD2_SQUIRCLE_D =
  "M 246 0 c 16.802 0 25.202 0 31.62 3.27 a 30 30 0 0 1 13.11 13.11 c 3.27 6.417 3.27 14.818 3.27 31.62 L 294 340 c 0 16.802 0 25.202 -3.27 31.62 a 30 30 0 0 1 -13.11 13.11 c -6.417 3.27 -14.818 3.27 -31.62 3.27 L 48 388 c -16.802 0 -25.202 0 -31.62 -3.27 a 30 30 0 0 1 -13.11 -13.11 c -3.27 -6.417 -3.27 -14.818 -3.27 -31.62 L 0 48 c 0 -16.802 0 -25.202 3.27 -31.62 a 30 30 0 0 1 13.11 -13.11 c 6.417 -3.27 14.818 -3.27 31.62 -3.27 Z"
const CARD2_SQUIRCLE = `path('${CARD2_SQUIRCLE_D}')`

// Блок-строка списка Quizzes: тот же iOS-squircle (радиус 30, сглаживание 60%), размер 346×88.
// На высоте 88 алгоритм figma-squircle поджимает сглаживание, чтобы углы влезли.
const QUIZ_SQUIRCLE_D =
  'M 306 0 c 9.2997 0 13.9496 0 17.7646 1.0222 a 30 30 0 0 1 21.2132 21.2132 c 1.0222 3.815 1.0222 8.4649 1.0222 17.7646 L 346 40 c 0 9.2997 0 13.9496 -1.0222 17.7646 a 30 30 0 0 1 -21.2132 21.2132 c -3.815 1.0222 -8.4649 1.0222 -17.7646 1.0222 L 40 80 c -9.2997 0 -13.9496 0 -17.7646 -1.0222 a 30 30 0 0 1 -21.2132 -21.2132 c -1.0222 -3.815 -1.0222 -8.4649 -1.0222 -17.7646 L 0 40 c 0 -9.2997 0 -13.9496 1.0222 -17.7646 a 30 30 0 0 1 21.2132 -21.2132 c 3.815 -1.0222 8.4649 -1.0222 17.7646 -1.0222 Z'
const QUIZ_SQUIRCLE = `path('${QUIZ_SQUIRCLE_D}')`

// Стек-гармошка Quizzes (как уведомления iOS): в сложенном виде каждый блок выше следующего
// на (96 − QUIZ_FAN) = peek, чуть мельче по scale; при скролле раскрывается до шага 96.
const QUIZ_FAN = 60 // насколько схлопывается шаг 88 в сложенном виде (peek = 28px)
const QUIZ_SCALE_STEP = 0.025 // каждый следующий блок в стопке чуть мельче

// Вопросы в блоках Quizzes (по порядку сверху вниз)
const QUIZ_QUESTIONS = [
  'What makes you hard to forget?',
  'Your romantic archetype',
  "What's quietly holding you back?",
  'Your attachment style',
  'What shaped your patterns?',
  'The energy you give off without trying',
]

// Карточка секции Mirrors: тот же iOS-squircle (радиус 30, сглаживание 60%), размер 250×360 (края по 76).
const MIRROR_SQUIRCLE_D =
  'M 202 0 c 16.8016 0 25.2024 0 31.6197 3.2698 a 30 30 0 0 1 13.1105 13.1105 c 3.2698 6.4174 3.2698 14.8181 3.2698 31.6197 L 250 312 c 0 16.8016 0 25.2024 -3.2698 31.6197 a 30 30 0 0 1 -13.1105 13.1105 c -6.4174 3.2698 -14.8181 3.2698 -31.6197 3.2698 L 48 360 c -16.8016 0 -25.2024 0 -31.6197 -3.2698 a 30 30 0 0 1 -13.1105 -13.1105 c -3.2698 -6.4174 -3.2698 -14.8181 -3.2698 -31.6197 L 0 48 c 0 -16.8016 0 -25.2024 3.2698 -31.6197 a 30 30 0 0 1 13.1105 -13.1105 c 6.4174 -3.2698 14.8181 -3.2698 31.6197 -3.2698 Z'
const MIRROR_SQUIRCLE = `path('${MIRROR_SQUIRCLE_D}')`

// 6 зеркал (тайтл + сабхедер внутри карточки)
const MIRRORS = [
  { t: 'Inner Child', s: 'Meet the part of you still waiting to be seen.' },
  { t: 'Shadow Self', s: 'See the side you keep out of frame.' },
  { t: 'Soul Mandala', s: 'Your inner world, drawn as one pattern.' },
  { t: 'Anxiety Creature', s: 'Give the dread a face you can look at.' },
  { t: 'Hidden Archetype', s: 'The figure you’ve been all along.' },
  { t: 'Emotional Imprint', s: 'See what the week actually left on you.' },
]

// Переливания CTA: текст-градиент бежит, белый блик ходит туда-сюда.
const CTA_KEYFRAMES = `
@keyframes ctaTextShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
@keyframes ctaSheen { 0% { transform: translateX(-140%); } 100% { transform: translateX(140%); } }
@keyframes ctaGlassDrift { 0%, 100% { transform: translateX(-16px); } 50% { transform: translateX(16px); } }
@keyframes ctaBurst { 0% { transform: scale(0.2); opacity: 0; } 22% { opacity: 0.85; } 100% { transform: scale(1.9); opacity: 0; } }
`

export function HomeScreen(_props: { onLinkPress?: () => void }) {
  const [micPressed, setMicPressed] = useState(false)
  const [micBurst, setMicBurst] = useState(0) // счётчик нажатий — ретриггерит бёрст
  const [platePressed, setPlatePressed] = useState(false) // тап по плашке → расплющивание в стороны
  // Масштаб всего 402-макета под ширину устройства (отступы/тайтл/инпут/карточки — пропорционально)
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const apply = () => setZoom(window.innerWidth / DESIGN_WIDTH)
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  // СНАП на НАТИВНОМ скролле (страница заполняет экран — никакой подложки).
  // На отрыве пальца: мгновенно гасим инерцию iOS (overflow:hidden на миг) и сами
  // плавно догоняем скролл до точки (верх ИЛИ Explore@118) — один долёт, без отскока.
  const pageRef = useRef(0)
  useEffect(() => {
    const scroller = (document.scrollingElement || document.documentElement) as HTMLElement
    const htmlEl = document.documentElement
    let animating = false

    const points = () => {
      const pts = [0]
      const ex = document.getElementById('exploreAnchor')
      if (ex) pts.push(Math.max(0, Math.round(ex.getBoundingClientRect().top + scroller.scrollTop - 118)))
      const qz = document.getElementById('quizzesAnchor')
      if (qz) {
        // Quizzes снапится на 40px выше остальных (тайтл на 78, не 118) — больше места блокам
        pts.push(Math.max(0, Math.round(qz.getBoundingClientRect().top + scroller.scrollTop - 78)))
      }
      const mr = document.getElementById('mirrorsAnchor')
      if (mr) pts.push(Math.max(0, Math.round(mr.getBoundingClientRect().top + scroller.scrollTop - 118)))
      return pts.sort((a, b) => a - b)
    }
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

    const glide = (target: number) => {
      const start = scroller.scrollTop
      if (Math.abs(target - start) < 2) return
      animating = true
      const prev = htmlEl.style.overflow
      htmlEl.style.overflow = 'hidden' // мгновенно убивает инерцию/резину iOS
      const dur = 480
      const t0 = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur)
        scroller.scrollTop = Math.round(start + (target - start) * ease(p))
        if (p < 1) requestAnimationFrame(step)
        else {
          htmlEl.style.overflow = prev
          animating = false
        }
      }
      requestAnimationFrame(step)
    }
    const goDir = (dir: number) => {
      const pts = points()
      const np = Math.max(0, Math.min(pts.length - 1, pageRef.current + dir))
      pageRef.current = np
      glide(pts[np])
    }

    let sx = 0, sy = 0, decided: 'none' | 'v' | 'h' = 'none', active = false
    const onTS = (e: TouchEvent) => {
      if (animating) return
      const t = e.touches[0]; sx = t.clientX; sy = t.clientY; decided = 'none'; active = true
    }
    const onTM = (e: TouchEvent) => {
      if (!active || decided !== 'none') return
      const t = e.touches[0], dx = t.clientX - sx, dy = t.clientY - sy
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) decided = Math.abs(dy) > Math.abs(dx) ? 'v' : 'h'
    }
    const onTE = (e: TouchEvent) => {
      if (!active) return
      active = false
      if (decided !== 'v') return // горизонталь = свайп карточек, страницу не трогаем
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dy) < 36) return
      goDir(dy < 0 ? 1 : -1)
    }

    let wheelLock = false
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8 || wheelLock || animating) return
      wheelLock = true; setTimeout(() => { wheelLock = false }, 560)
      goDir(e.deltaY > 0 ? 1 : -1)
    }

    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchmove', onTM, { passive: true })
    window.addEventListener('touchend', onTE, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTS)
      window.removeEventListener('touchmove', onTM)
      window.removeEventListener('touchend', onTE)
      window.removeEventListener('wheel', onWheel)
    }
  }, [zoom])

  // Раскрытие стека Quizzes «гармошкой» (iOS notification-center), завязано на скролл.
  // ТЕНТ: p=0 на Explore → p=1 на Quizzes (раскрытие на подъезде) → p=0 на Mirrors (схлопывание при свайпе дальше).
  // Перф: позиции якорей и список блоков считаем ОДИН раз (measure), а в кадре только читаем scrollTop
  // и пишем transform — без getBoundingClientRect каждый кадр (иначе layout thrash → дёрганье на телефоне).
  useEffect(() => {
    const scroller = (document.scrollingElement || document.documentElement) as HTMLElement
    let raf = 0
    let exOff = 0
    let qc = 0
    let mirOff = 0
    let blocks: HTMLElement[] = []
    const measure = () => {
      const st = scroller.scrollTop
      const ex = document.getElementById('exploreAnchor')
      const qz = document.getElementById('quizzesAnchor')
      const mr = document.getElementById('mirrorsAnchor')
      blocks = Array.from(document.querySelectorAll<HTMLElement>('.quizBlock'))
      qc = qz ? qz.getBoundingClientRect().top + st - 118 : 0
      exOff = ex ? ex.getBoundingClientRect().top + st - 118 : qc - 553
      mirOff = mr ? mr.getBoundingClientRect().top + st - 118 : qc + 553
    }
    const apply = () => {
      raf = 0
      if (!blocks.length) return
      const st = scroller.scrollTop
      // только раскрытие на подъезде Explore→Quizzes; дальше остаётся раскрытым (НЕ схлопываем — иначе дыра)
      const p = qc > exOff ? Math.max(0, Math.min(1, (st - exOff) / (qc - exOff))) : 1
      for (let i = 0; i < blocks.length; i++) {
        const ty = -QUIZ_FAN * i * (1 - p)
        const sc = 1 - QUIZ_SCALE_STEP * i * (1 - p)
        blocks[i].style.transform = `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onResize = () => {
      measure()
      apply()
    }
    measure()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [zoom])

  return (
    // @ts-ignore — web <div> обёртка: тянем весь интерфейс на 62px вверх под статус-бар
    <div style={{ marginTop: -62 }}>
    <YStack
      position="relative"
      width={DESIGN_WIDTH}
      // @ts-ignore — zoom + фон = нижний край градиента (lefts blue → right pink), чтобы спейсер снизу
      // продолжал картинку бесшовно (без лавандовой подложки), когда страница длиннее PNG
      style={{ zoom, background: 'linear-gradient(90deg, rgb(107,142,187) 0%, rgb(166,153,179) 100%)' }}
    >
      {/* ФОН — длинный PNG во всю ширину, натуральная высота (страница скроллится по нему) */}
      {/* @ts-ignore — web <img> */}
      <img
        src="/selfray-bg.png"
        alt=""
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
      {/* спейсер: продлевает прокрутку ниже PNG (на фоне YStack-градиента), чтобы Mirrors доезжал до снапа */}
      {/* @ts-ignore — web in-flow spacer */}
      <div style={{ width: '100%', height: 195 }} />


      {/* «Selfray» — Lexend Bold, 20/33, белый, top 89 / left 28 */}
      <Text
        fontFamily="$heading"
        fontWeight="700"
        fontSize={20}
        lineHeight={33}
        letterSpacing={0.5}
        color="#FFFFFF"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 89, left: 28, zIndex: 2 }}
      >
        Selfray
      </Text>

      {/* «X-Ray any» — Lexend Bold, 58/48, белый, по центру, top 200, отступы 28 */}
      <Text
        fontFamily="$heading"
        fontWeight="700"
        fontSize={58}
        lineHeight={48}
        letterSpacing={-0.5}
        color="rgba(255,255,255,0.6)"
        textAlign="left"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 200, left: 28, right: 28, zIndex: 2, whiteSpace: 'nowrap' }}
      >
        X-Ray any
      </Text>

      {/* «part of your» — вторая строка заголовка, 1px ниже первой (200 + 48 + 1) */}
      <Text
        fontFamily="$heading"
        fontWeight="700"
        fontSize={58}
        lineHeight={48}
        letterSpacing={-0.5}
        color="#FFFFFF"
        textAlign="left"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 251, left: 28, right: 28, zIndex: 2, whiteSpace: 'nowrap' }}
      >
        part of your
      </Text>

      {/* «life» — третья строка, 1px ниже второй (249 + 48 + 1), по центру */}
      <Text
        fontFamily="$heading"
        fontWeight="700"
        fontSize={58}
        lineHeight={48}
        letterSpacing={-0.5}
        color="rgba(255,255,255,0.6)"
        textAlign="center"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 302, left: 28, right: 28, zIndex: 2, whiteSpace: 'nowrap' }}
      >
        life
      </Text>

      {/* Сабтайтл — вертикальная карусель фраз (Lexend Bold 28/36, белый, по центру) */}
      <RotatingSubtitle />

      {/* Уголки-рамка вокруг сабтайтла: TL слева-сверху, BR справа-снизу, отступ 28 от краёв */}
      {/* @ts-ignore — web <img> */}
      <img
        src="/frame-tl.svg"
        width={18}
        height={18}
        alt=""
        style={{ position: 'absolute', top: 392, left: 28, width: 18, height: 18, zIndex: 2 }}
      />
      {/* @ts-ignore — web <img> */}
      <img
        src="/frame-br.svg"
        width={18}
        height={18}
        alt=""
        style={{ position: 'absolute', top: 482, right: 28, width: 18, height: 18, zIndex: 2 }}
      />

      {/* CTA: rect h98, отступы 28, radius 30, #FAFAFA, shadow 0/2/42 black 10%,
          56px от нижнего кронштейна (низ кронштейна 500 + 56 = 556) */}
      <YStack
        position="absolute"
        height={98}
        onPointerDown={() => setPlatePressed(true)}
        onPointerUp={() => setPlatePressed(false)}
        onPointerCancel={() => setPlatePressed(false)}
        onPointerLeave={() => setPlatePressed(false)}
        // @ts-ignore — web-only: iOS-squircle + тень. Заливку/блик/бордер дают слои внутри.
        style={{
          top: 556,
          left: 28,
          right: 28,
          zIndex: 2,
          // тень на НЕобрезанной обёртке — clip-path внутри, иначе он срезает свой drop-shadow
          filter: 'drop-shadow(0px 2px 42px rgba(0,0,0,0.10))',
          transformOrigin: 'center center',
          transition: 'transform 150ms ease',
          transform: platePressed ? 'scaleX(1.04) scaleY(0.9)' : 'scaleX(1) scaleY(1)',
        }}
      >
        {/* @ts-ignore — внутренний clip-контейнер (squircle) */}
        <div style={{ position: 'absolute', inset: 0, clipPath: CTA_SQUIRCLE }}>
        <style>{CTA_KEYFRAMES}</style>

        {/* Стеклянная база — лёгкая белая полупрозрачность */}
        {/* @ts-ignore */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(250,250,250,0.5)' }} />

        {/* Переливающийся белый iOS-блик внутри */}
        {/* @ts-ignore */}
        <div
          style={{
            position: 'absolute',
            top: '-60%',
            bottom: '-60%',
            left: '-40%',
            right: '-40%',
            background:
              'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 70%)',
            filter: 'blur(26px)',
            animation: 'ctaSheen 5s linear infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Эпл-глесморфный градиент под микрофоном — живёт «туда-сюда» */}
        {/* @ts-ignore */}
        <div
          style={{
            position: 'absolute',
            right: -30,
            bottom: -30,
            width: 240,
            height: 170,
            background:
              'radial-gradient(closest-side, rgba(251,152,165,0.28), rgba(150,170,225,0.20) 55%, rgba(255,255,255,0) 82%)',
            filter: 'blur(20px)',
            animation: 'ctaGlassDrift 7s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Бёрст по нажатию микрофона — разлетается из центра кнопки (≈316,68 в коорд. плашки),
            под маской squircle. Ретриггерится ключом micBurst. */}
        {micBurst > 0 && (
          // @ts-ignore
          <div key={micBurst} style={{ position: 'absolute', left: 316, top: 68, pointerEvents: 'none' }}>
            {/* @ts-ignore */}
            <div
              style={{
                position: 'absolute',
                left: -120,
                top: -120,
                width: 240,
                height: 240,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(251,152,165,0.35) 38%, rgba(150,170,225,0.2) 64%, rgba(255,255,255,0) 80%)',
                filter: 'blur(10px)',
                transformOrigin: 'center',
                animation: 'ctaBurst 700ms ease-out forwards',
              }}
            />
          </div>
        )}

        {/* 1px линейно-градиентный бордер по контуру squircle (SVG stroke) — ровный во всех
            углах, включая левые/правые. stroke-width 2: внешнюю половину срезает clip-path → 1px внутри. */}
        {/* @ts-ignore */}
        <svg
          width={346}
          height={98}
          viewBox="0 0 346 98"
          fill="none"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="ctaBorderGrad" x1="0" y1="0" x2="346" y2="98" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
          </defs>
          <path d={CTA_SQUIRCLE_D} stroke="url(#ctaBorderGrad)" strokeWidth={2} fill="none" />
        </svg>

        {/* Заголовок — переливающийся градиент 2E3032 → FB98A5 */}
        <Text
          fontFamily="$body"
          fontWeight="500"
          fontSize={21}
          lineHeight={24}
          letterSpacing={0}
          // @ts-ignore — градиентный текст + позиционирование
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1,
            backgroundImage: 'linear-gradient(90deg, #2E3032 0%, #FB98A5 50%, #2E3032 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            animation: 'ctaTextShimmer 5s linear infinite',
          }}
        >
          Start anywhere
        </Text>

        {/* Плюс — левый нижний угол, 8px от левого и нижнего края */}
        {/* @ts-ignore — web <img> */}
        <img
          src="/btn-plus.svg"
          width={44}
          height={44}
          alt=""
          style={{ position: 'absolute', left: 8, bottom: 8, width: 44, height: 44, zIndex: 1 }}
        />
        </div>
      </YStack>

      {/* Круглая кнопка в ПРАВОМ НИЖНЕМ углу плейсхолдера: 44×44, #FAFAFA 70%, тень.
          Сосед карточки (не вложен), координаты = угол карточки минус 8px:
          карточка top556..654 / right-inset 28 → круг top 602, right-inset 36. */}
      <YStack
        width={44}
        height={44}
        borderRadius={22}
        backgroundColor="#FAFAFA"
        opacity={0.7}
        items="center"
        justify="center"
        onPressIn={() => {
          setMicPressed(true)
          setMicBurst((b) => b + 1)
        }}
        onPressOut={() => setMicPressed(false)}
        // @ts-ignore — web-only позиционирование, тень, тап-реакция
        style={{
          position: 'absolute',
          top: 602,
          right: 36,
          zIndex: 3,
          cursor: 'pointer',
          transformOrigin: 'center',
          // по тапу кнопка увеличивается буквально на пару пикселей (~scale 1.08), краёв не касается
          transform: micPressed ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 220ms cubic-bezier(0.34,1.4,0.64,1), box-shadow 220ms ease',
          // свечение теперь даёт разлетающийся бёрст под маской плашки, не box-shadow
          boxShadow: '0px 2px 42px rgba(0,0,0,0.10)',
        }}
      >
        {/* iOS белый градиент-бордер (кольцо через mask-exclude; на круге без «зарезов») */}
        {/* @ts-ignore */}
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
        {/* @ts-ignore — web <img>: микрофон по центру. Контр-масштаб (1/1.08), чтобы глиф
            не увеличивался вместе с кнопкой и оставался прежнего размера. */}
        <img
          src="/mic.svg"
          width={44}
          height={44}
          alt=""
          style={{
            width: 44,
            height: 44,
            transformOrigin: 'center',
            transform: micPressed ? 'scale(0.926)' : 'scale(1)',
            transition: 'transform 220ms cubic-bezier(0.34,1.4,0.64,1)',
          }}
        />
      </YStack>

      {/* Секция «Explore X-Rays» — тайтл 78px от низа плашки (654+78=732), Lexend Black, белый */}
      <Text
        fontFamily="$heading"
        fontWeight="900"
        fontSize={28}
        lineHeight={36}
        letterSpacing={0}
        color="#FFFFFF"
        textAlign="center"
        id="exploreAnchor"
        // @ts-ignore — web-only позиционирование (якорь JS-снапа)
        style={{ position: 'absolute', top: 732, left: 28, right: 28, zIndex: 2 }}
      >
        Explore X-Rays
      </Text>

      {/* Сабтайтл — Hanken Grotesk Medium 17/22, 8px от тайтла (768+8=776) */}
      <Text
        fontFamily="$body"
        fontWeight="500"
        fontSize={17}
        lineHeight={22}
        letterSpacing={0}
        color="#FFFFFF"
        textAlign="center"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 776, left: 28, right: 28, zIndex: 2 }}
      >
        Pick a lens. See the pattern underneath
      </Text>

      {/* Колода карточек X-Ray (стек −0/−5/−10°, свайпом листается) — на месте бывшей карточки */}
      <ExesDeck top={834} left={54} />

      {/* Секция «Quizzes» — 36px от низа предыдущего блока (каунтер: 834+412+20=1266 → 1302) */}
      <Text
        fontFamily="$heading"
        fontWeight="900"
        fontSize={28}
        lineHeight={36}
        letterSpacing={0}
        color="#FFFFFF"
        textAlign="center"
        id="quizzesAnchor"
        // @ts-ignore — web-only позиционирование (якорь JS-снапа)
        style={{ position: 'absolute', top: 1302, left: 28, right: 28, zIndex: 2 }}
      >
        Quizzes
      </Text>

      {/* Сабтайтл — Hanken Grotesk Medium 17/22, 8px от тайтла (1338+8=1346) */}
      <Text
        fontFamily="$body"
        fontWeight="500"
        fontSize={17}
        lineHeight={22}
        letterSpacing={0}
        color="#FFFFFF"
        textAlign="center"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 1346, left: 28, right: 28, zIndex: 2 }}
      >
        Quick scans. Uncomfortable accuracy.
      </Text>

      {/* 6 блоков-строк: 24px от сабтайтла (1368+24=1392), высота 80, край 28, между блоками 8 (шаг 88).
          Скругление/бордер/тень как у карточек: squircle r30, белый градиент-бордер, мягкая тень 8%. */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        // @ts-ignore — web-only; начальное состояние = СЛОЖЕНО (p=0), раскрытие гонит scroll-эффект
        <div
          key={i}
          className="quizBlock"
          style={{
            position: 'absolute',
            top: 1392 + i * 88,
            left: 28,
            width: 346,
            height: 80,
            zIndex: 100 - i, // верхний блок стопки над нижними при наложении
            transformOrigin: 'top center',
            willChange: 'transform',
            transform: `translateY(${-QUIZ_FAN * i}px) scale(${(1 - QUIZ_SCALE_STEP * i).toFixed(3)})`,
          }}
        >
          <Pressable style={{ position: 'absolute', inset: 0 }}>
          {/* нижний слой: бекдроп-блюр градиента (НЕ под filter — иначе backdrop-filter не работает) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: QUIZ_SQUIRCLE,
              WebkitBackdropFilter: 'blur(37px)',
              backdropFilter: 'blur(37px)',
            }}
          />
          {/* белая плашка 80% + тень (drop-shadow на НЕобрезанной обёртке = тень по форме squircle) */}
          <div style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0px 8px 22px rgba(2,1,10,0.08))' }}>
            <div style={{ position: 'absolute', inset: 0, clipPath: QUIZ_SQUIRCLE, backgroundColor: 'rgba(250,250,250,0.5)' }}>
              <svg
                width={346}
                height={80}
                viewBox="0 0 346 80"
                fill="none"
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              >
                <defs>
                  <linearGradient id="quizBorderGrad" x1="0" y1="0" x2="346" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
                  </linearGradient>
                </defs>
                <path d={QUIZ_SQUIRCLE_D} stroke="url(#quizBorderGrad)" strokeWidth={2} fill="none" />
              </svg>
            </div>
          </div>
          {/* Иллюстрация квиза: квадрат 64×64, 8px от левого края, по центру вертикали (блок 80 → top 8) */}
          {/* @ts-ignore — web-only */}
          <div style={{ position: 'absolute', left: 8, top: 8, width: 64, height: 64, borderRadius: 12, backgroundColor: '#FFFFFF', overflow: 'hidden', zIndex: 3, pointerEvents: 'none' }}>
            {/* @ts-ignore — web <img> */}
            <img
              src={`/Quizzes/0${i + 1}.png`}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          {/* Вопрос: 10px от квадрата (72+10=82), правая граница = 40px до стрелки (right 78) */}
          {/* @ts-ignore — web-only */}
          <div style={{ position: 'absolute', left: 82, right: 78, top: 0, bottom: 0, display: 'flex', alignItems: 'center', zIndex: 3, pointerEvents: 'none' }}>
            <Text fontFamily="$body" fontWeight="500" fontSize={17} lineHeight={22} letterSpacing={0} color="#41474F">
              {QUIZ_QUESTIONS[i]}
            </Text>
          </div>
          {/* Стрелка справа — 18px от правого края блока, по центру вертикали (блок 80, иконка 20 → top 30) */}
          {/* @ts-ignore — web <img> */}
          <img
            src="/quiz-arrow.svg"
            width={20}
            height={20}
            alt=""
            style={{ position: 'absolute', right: 18, top: 30, width: 20, height: 20, zIndex: 3, pointerEvents: 'none' }}
          />
          </Pressable>
        </div>
      ))}

      {/* Секция «Mirrors» — 36px от низа блоков Quizzes (последний: 1872+88=1960 → 1996) */}
      <Text
        fontFamily="$heading"
        fontWeight="900"
        fontSize={28}
        lineHeight={36}
        letterSpacing={0}
        color="#FFFFFF"
        textAlign="center"
        id="mirrorsAnchor"
        // @ts-ignore — web-only позиционирование (якорь JS-снапа)
        style={{ position: 'absolute', top: 1948, left: 28, right: 28, zIndex: 2 }}
      >
        Mirrors
      </Text>

      {/* Сабтайтл — Hanken Grotesk Medium 17/22, 8px от тайтла (2032+8=2040) */}
      <Text
        fontFamily="$body"
        fontWeight="500"
        fontSize={17}
        lineHeight={22}
        letterSpacing={0}
        color="#FFFFFF"
        textAlign="center"
        // @ts-ignore — web-only позиционирование
        style={{ position: 'absolute', top: 1992, left: 28, right: 28, zIndex: 2 }}
      >
        Your inner weather, made visible.
      </Text>
      {/* (Mirrors-секция сдвинута вверх на 48 вслед за уменьшением блоков Quizzes: 88→80, шаг 96→88) */}

      {/* Mirrors — коверфлоу-листалка: свайп по картам ИЛИ слайдер-таблетка листают карты. */}
      <MirrorsCarousel />

      {/* Аватарка 44×44, top 84 / right 28 */}
      {/* @ts-ignore — web <img> */}
      <img
        src="/avatar.svg"
        width={44}
        height={44}
        alt="avatar"
        style={{ position: 'absolute', top: 84, right: 28, width: 44, height: 44, zIndex: 2 }}
      />
    </YStack>
    </div>
  )
}

// Тап-эффект как у колоды: лёгкое нажатие. squash=true → расплющивание в стороны (шире/ниже),
// иначе — равномерное сжатие. Обёртка кладётся внутрь карточки (position:absolute, inset:0).
function Pressable({
  children,
  squash,
  style,
}: {
  children: React.ReactNode
  squash?: boolean
  style?: React.CSSProperties
}) {
  const [pressed, setPressed] = useState(false)
  const t = pressed ? (squash ? 'scaleX(1.05) scaleY(0.9)' : 'scale(0.96)') : 'scale(1)'
  return (
    // @ts-ignore — web-only
    <div
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ transformOrigin: 'center center', transition: 'transform 150ms ease', ...style, transform: t }}
    >
      {children}
    </div>
  )
}

// Коверфлоу-листалка Mirrors: центр + по 2 карты с каждой стороны (перспектива).
// Листается свайпом по картам И слайдером-таблеткой снизу (бегунок = текущая карта).
function MirrorsCarousel() {
  const N = MIRRORS.length
  const [idx, setIdx] = useState(0) // дефолт — первая карта по центру
  const clamp = (v: number) => Math.max(0, Math.min(N - 1, v))
  const go = (d: number) => setIdx((v) => clamp(v + d))

  // свайп по картам
  const cdrag = useRef(false)
  const csx = useRef(0)
  const cdx = useRef(0)
  const onCDown = (e: any) => {
    cdrag.current = true
    csx.current = e.clientX
    cdx.current = 0
  }
  const onCMove = (e: any) => {
    if (cdrag.current) cdx.current = e.clientX - csx.current
  }
  const onCUp = () => {
    if (!cdrag.current) return
    cdrag.current = false
    if (Math.abs(cdx.current) > 40) go(cdx.current < 0 ? 1 : -1)
  }

  // слайдер-таблетка
  const TRACK = 250
  const THUMB = 96
  const PAD = 0 // бегунок встык к краям пилюли
  const travel = TRACK - THUMB - PAD * 2
  const thumbLeft = PAD + (N > 1 ? (idx / (N - 1)) * travel : 0)
  const trackRef = useRef<HTMLDivElement>(null)
  const sdrag = useRef(false)
  const setFromX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const z = window.innerWidth / DESIGN_WIDTH
    const x = (clientX - rect.left) / z // в дизайн-px
    const frac = Math.max(0, Math.min(1, (x - THUMB / 2 - PAD) / travel))
    setIdx(clamp(Math.round(frac * (N - 1))))
  }
  const onSDown = (e: any) => {
    sdrag.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setFromX(e.clientX)
  }
  const onSMove = (e: any) => {
    if (sdrag.current) setFromX(e.clientX)
  }
  const onSUp = () => {
    sdrag.current = false
  }

  const cardStyle = (i: number): React.CSSProperties => {
    const slot = i - idx
    const a = Math.abs(slot)
    const sgn = slot < 0 ? -1 : 1
    const x = slot === 0 ? 0 : sgn * (a === 1 ? 98 : a === 2 ? 170 : 240)
    const ry = slot === 0 ? 0 : -sgn * (a === 1 ? 45 : a === 2 ? 62 : 72)
    const s = slot === 0 ? 1 : a === 1 ? 0.9 : a === 2 ? 0.8 : 0.7
    return {
      position: 'absolute',
      top: 0,
      left: 76,
      width: 250,
      height: 360,
      transformOrigin: 'center center',
      transform: `translateX(${x}px) rotateY(${ry}deg) scale(${s})`,
      opacity: a > 2 ? 0 : 1,
      zIndex: 30 - a * 10,
      pointerEvents: a > 2 ? 'none' : 'auto',
      transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease',
    }
  }

  return (
    <>
      {/* @ts-ignore — коверфлоу с перспективой + свайп (pan-y = вертикальный скролл страницы остаётся) */}
      <div
        onPointerDown={onCDown}
        onPointerMove={onCMove}
        onPointerUp={onCUp}
        onPointerCancel={onCUp}
        style={{ position: 'absolute', top: 2038, left: 0, width: DESIGN_WIDTH, height: 360, zIndex: 2, perspective: '900px', touchAction: 'pan-y' }}
      >
        {Array.from({ length: N }).map((_, i) => (
          // @ts-ignore — карта коверфлоу
          <div key={i} style={cardStyle(i)}>
            <Pressable style={{ position: 'absolute', inset: 0 }}>
              <MirrorGlass image="/mirror1.png" />
              {/* @ts-ignore — тайтл на 28px от верха карточки, сабхедер 8px ниже; по центру по горизонтали */}
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  top: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              >
                <Text fontFamily="$heading" fontWeight="900" fontSize={22} lineHeight={28} letterSpacing={0} color="#41474F" textAlign="center">
                  {MIRRORS[i].t}
                </Text>
                <Text
                  fontFamily="$body"
                  fontWeight="500"
                  fontSize={17}
                  lineHeight={22}
                  letterSpacing={0}
                  color="#41474F"
                  textAlign="center"
                  marginTop={8}
                >
                  {MIRRORS[i].s}
                </Text>
              </div>
            </Pressable>
          </div>
        ))}
      </div>

      {/* @ts-ignore — слайдер-таблетка: тап/перетаскивание бегунка выбирает карту */}
      <div
        ref={trackRef}
        onPointerDown={onSDown}
        onPointerMove={onSMove}
        onPointerUp={onSUp}
        onPointerCancel={onSUp}
        style={{
          position: 'absolute',
          top: 2438,
          left: 76,
          width: 250,
          height: 44,
          zIndex: 31,
          borderRadius: 22,
          backgroundColor: 'rgba(250,250,250,0.4)',
          border: '1.5px solid rgba(255,255,255,0.55)',
          WebkitBackdropFilter: 'blur(37px)',
          backdropFilter: 'blur(37px)',
          touchAction: 'none',
          cursor: 'pointer',
        }}
      >
        {/* @ts-ignore — бегунок: встык по высоте (44) и к краям */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: thumbLeft,
            width: THUMB,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(250,250,250,0.9)',
            transition: 'left 320ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>
    </>
  )
}

// Стеклянная грань карточки Mirrors (250×360): бекдроп-блюр + плашка (цвет плашки) + градиент-бордер.
// Вынесено, чтобы переиспользовать в коверфлоу (5 карт).
function MirrorGlass({ image }: { image?: string }) {
  return (
    <>
      {/* @ts-ignore — бекдроп-блюр (вне filter, иначе backdrop-filter не работает) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: MIRROR_SQUIRCLE,
          WebkitBackdropFilter: 'blur(37px)',
          backdropFilter: 'blur(37px)',
        }}
      />
      {/* @ts-ignore — плашка + тень по форме squircle */}
      <div style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0px 8px 22px rgba(2,1,10,0.08))' }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: MIRROR_SQUIRCLE, backgroundColor: 'rgba(250,250,250,0.5)' }}>
          {image ? (
            // @ts-ignore — картинка по центру карты (обрезана squircle), бордер рисуется поверх
            <img
              src={image}
              alt=""
              draggable={false}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : null}
          <svg
            width={250}
            height={360}
            viewBox="0 0 250 360"
            fill="none"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <defs>
              <linearGradient id="mirrorBorderGrad" x1="0" y1="0" x2="250" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
              </linearGradient>
            </defs>
            <path d={MIRROR_SQUIRCLE_D} stroke="url(#mirrorBorderGrad)" strokeWidth={2} fill="none" />
          </svg>
        </div>
      </div>
    </>
  )
}
