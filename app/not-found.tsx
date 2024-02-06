import Footer from '@/components/footer'
import Header from '@/components/header'
import '@/styles/NotFound.sass'

export default function NotFound() {
  return (
    <html lang="ko">
      <body>
        <Header />
        <div className="not-found">
          <h2>Not Found</h2>
        </div>
        <Footer />
      </body>
    </html>
  )
}
