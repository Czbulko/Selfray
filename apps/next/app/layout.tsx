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
  themeColor: '#928EB1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // You can use `suppressHydrationWarning` to avoid the warning about mismatched content during hydration in dev mode
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* Standalone (добавлено на домашний экран): контент рисуется ПОД статус-баром,
            часы/батарея ложатся поверх градиента — плоской полосы больше нет.
            В обычной вкладке Safari полоса неизбежна (её красит сам браузер по theme-color). */}
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
              // ФОН ПОД ЧЁЛКОЙ/HOME-ИНДИКАТОРОМ (safe-area). Раньше был сплошной лавандовый —
              // из-за этого снизу, где контент уже сине-розовый, вылезала лавандовая полоса.
              // Теперь вертикальный градиент: верх = цвет верха PNG (лавандовый), низ = цвет низа PNG (синий).
              // background-attachment:fixed → привязан к вьюпорту, так что любая открытая safe-area совпадает.
              'html,body{background:linear-gradient(180deg, rgb(146,142,177) 0%, rgb(133,146,185) 100%) !important; background-attachment:fixed !important;}' +
              // ПЕЙДЖЕР: нативный скролл выключен — экраны переключаются свайпом (transform).
              // Так горизонтальные свайпы колоды/карусели не таскают страницу по вертикали.
              'html,body{height:100%;overflow:hidden;overscroll-behavior:none;}',
          }}
        />
      </head>
      <body>
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  )
}
