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
  themeColor: '#B1AFD0',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // You can use `suppressHydrationWarning` to avoid the warning about mismatched content during hydration in dev mode
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
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
              // фон под статус-баром/чёлкой и по краям = цвет верха градиента (иначе проступает белый body)
              'html,body{background:#B1AFD0 !important;}' +
              // свайп карты вбок не должен таскать страницу: режем горизонтальный скролл/оверскролл
              'html,body{overflow-x:hidden;overscroll-behavior-x:none;}',
          }}
        />
      </head>
      <body>
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  )
}
