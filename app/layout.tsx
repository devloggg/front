import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devlog',
  description: 'Devlog, log your dev life',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
