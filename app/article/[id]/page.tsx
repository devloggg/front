import { notFound } from 'next/navigation'
import Article from './article'
import '@/styles/Article.sass'

interface FetchData {
  title: string
  index: number
  releaseDate: string
  updateDate: string
  mainAuthor: string
}

export default async function Page({ params }: { params: { id: string } }) {
  const res: FetchData | null = await fetch(`/article/${params.id}`)
    .then((r) => r.json())
    .then((j) => ({
      title: j.title,
      index: j.index as number,
      releaseDate: j.releaseDate,
      updateDate: j.updateDate,
      mainAuthor: j.mainAuthor,
    }))
    .catch(() => null)

  if (res === null) {
    notFound()
  }

  return (
    <div className="main__section">
      <Article url="https://raw.githubusercontent.com/devloggg/front/main/public/test/test_article.json" />
    </div>
  )
}
