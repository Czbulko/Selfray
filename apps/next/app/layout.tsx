import type { Metadata, Viewport } from 'next'
import { NextTamaguiProvider } from 'app/provider/NextTamaguiProvider'

export const metadata: Metadata = {
  title: 'Selfray',
  description: 'Selfray — прототип',
  icons: '/favicon.ico',
}

// Мобильный Safari: device-width + viewport-fit=cover, чтобы работали env(safe-area-inset-*)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#938DB3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // You can use `suppressHydrationWarning` to avoid the warning about mismatched content during hydration in dev mode
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* Standalone (с домашнего экрана): Safari-чрома НЕТ вообще — ни статус-полосы, ни адресной
            строки. black-translucent → контент рисуется ПОД часами/батареей (там лавандовый фон),
            белого «потолка» нет. Это единственный способ полностью убрать бар (во вкладке его рисует
            сам Safari и со страницы не перекрасить). */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Selfray" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Сглаживание как в Figma: subpixel (auto) утолщает шрифт — antialiased делает его тоньше */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              'html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;}' +
              // ФОН ПОД ЧЁЛКОЙ/HOME-ИНДИКАТОРОМ (safe-area): вертикальный градиент,
              // верх = цвет верха PNG (лавандовый), низ = цвет низа PNG (синий).
              // ВАЖНО: НЕ ставим background-attachment:fixed — в iOS Safari он глючит и фон
              // не отрисовывается (вылезает белый холст). body занимает весь вьюпорт (height:100%),
              // поэтому градиент и так покрывает экран сверху донизу.
              'html,body{background:linear-gradient(180deg, rgb(147,141,179) 0%, rgb(140,146,183) 55%, rgb(133,146,185) 100%) !important;}' +
              // НАТИВНЫЙ СКРОЛЛ СО СНАПОМ (а не overflow:hidden-поэкранка): благодаря реальному
              // скроллу нижний бар Safari сворачивается → сайт на весь экран, полосы снизу нет.
              // scroll-snap-type:y mandatory + scroll-snap-align:start на тайтлах = чёткая поэкранка.
              // Тряску колоды/карусели глушим через touch-action на самих элементах (см. screen.tsx).
              // overflow-x:clip режем горизонталь (карты колоды/карусели вылезают за 402px) — но
              // ТОЛЬКО на body. На <html> любой overflow ломает iOS: фон корня перестаёт затекать
              // в safe-area под статус-баром → там белая полоса, и весь контент опускается на высоту
              // safe-area. Поэтому html остаётся overflow:visible (фон затекает под чёлку = лаванда,
              // и контент поднимается под статус-бар). Горизонтальный скролл всё равно невозможен —
              // body уже обрезал вылет.
              'html{scroll-snap-type:y mandatory;overscroll-behavior:none;}' +
              'body{overflow-x:clip;overscroll-behavior:none;}',
          }}
        />
        {/* Pull-to-refresh / любая перезагрузка должны открывать ПЕРВЫЙ экран (герой). Без этого
            браузер восстанавливает прошлую позицию скролла, а mandatory-снап «дотягивает» её до
            второго экрана. Скрипт ставит manual ДО восстановления (на парсинге head). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);",
          }}
        />
      </head>
      <body>
        {/* ФУЛЛСКРИН-ФОН ПОД ВСЕМ. position:fixed со слоем, вылезающим на 20vh за каждый край →
            рисуется и под полупрозрачным тулбаром Safari, и под чёлкой/home-индикатором.
            Так в зоне тулбара виден градиент (а не белый чром Safari) — полоса исчезает.
            zIndex:-1 + pointerEvents:none → строго позади контента, тачи не перехватывает. */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            top: '-20vh',
            bottom: '-20vh',
            left: 0,
            right: 0,
            zIndex: -1,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgb(147,141,179) 0%, rgb(140,146,183) 55%, rgb(133,146,185) 100%)',
          }}
        />
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  )
}
