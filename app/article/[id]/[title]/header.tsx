export default function ArticleHeader({
  params,
}: {
  params: {
    title: string
    updateDate: string
    releaseDate: string
    mainAuthor: string
  }
}): React.ReactNode {
  return (
    <div className="article__header">
      <div className="title">
        <h1>{params.title}</h1>
        <div className="bar" />
      </div>
      <div className="info">
        <li>
          <p>update date: {params.updateDate}</p>
          <p>release date: {params.releaseDate}</p>
        </li>
        <li>
          <p>by {params.mainAuthor}</p>
        </li>
        <div className="bar" />
      </div>
    </div>
  )
}
