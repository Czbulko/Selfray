'use client'

import { useEffect, useState } from 'react'
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
  // Масштаб всего 402-макета под ширину устройства (отступы/тайтл/инпут/карточки — пропорционально)
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const apply = () => setZoom(window.innerWidth / DESIGN_WIDTH)
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])
  return (
    <YStack
      position="relative"
      width={DESIGN_WIDTH}
      // @ts-ignore — zoom масштабирует весь 402-макет под ширину устройства; marginTop поднимает под статус-бар
      style={{ zoom, marginTop: 'calc(env(safe-area-inset-top, 0px) * -1)' }}
    >
      {/* ФОН — длинный PNG во всю ширину, натуральная высота (страница скроллится по нему) */}
      {/* @ts-ignore — web <img> */}
      <img
        src="/selfray-bg.png"
        alt=""
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />

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
        color="#FFFFFF"
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
        color="#FFFFFF"
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
        // @ts-ignore — web-only: iOS-squircle + тень. Заливку/блик/бордер дают слои внутри.
        style={{
          top: 556,
          left: 28,
          right: 28,
          zIndex: 2,
          // тень на НЕобрезанной обёртке — clip-path внутри, иначе он срезает свой drop-shadow
          filter: 'drop-shadow(0px 2px 42px rgba(0,0,0,0.10))',
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
        // @ts-ignore — web-only позиционирование
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
  )
}
