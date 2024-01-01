import Footer from '@/components/footer'
import Header from '@/components/header'
import { Metadata } from 'next'

import '@/styles/DefaultLayout.sass'

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
      <body>
        <Header />
        <div className="main__content">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
