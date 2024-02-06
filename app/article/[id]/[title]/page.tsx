import host from '@/config/config'

import { notFound } from 'next/navigation'
import Article from './article'
import '@/styles/Article.sass'
import ArticleHeader from './header'

interface ArticleMetadata {
  title: string
  releaseDate: string
  updateDate: string
  authorUUID: string
}

export default async function Page({
  params,
}: {
  params: { id: string; title: string }
}) {
  const res: ArticleMetadata | null = await fetch(
    `${host}/article/metadata/${params.id}/${params.title}`,
  )
    .then((r) => r.json())
    .then((j) => ({
      title: j.title,
      index: j.index as number,
      releaseDate: j.releaseDate,
      updateDate: j.updateDate,
      authorUUID: j.mainAuthor,
    }))
    .catch(() => null)

  if (res === null) {
    notFound()
  }

  const [author] = await Promise.all([
    fetch(`${host}/user/name-by-uuid/${res.authorUUID}`)
      .then((r) => r.json())
      .then((j) => j.name)
      .catch(() => ''),
  ])

  return (
    <div className="main__section">
      <ArticleHeader
        params={{
          title: res.title,
          updateDate: res.updateDate,
          releaseDate: res.releaseDate,
          mainAuthor: author,
        }}
      />
      <Article url={`${host}/article/${params.id}/${params.title}`} />
    </div>
  )
}
