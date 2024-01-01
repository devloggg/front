'use client'

import Image from 'next/image'

import { useEffect, useMemo, useState } from 'react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import markedKatex from 'marked-katex-extension'
import historyIcon from '../../public/icons/history_FILL0_wght400_GRAD0_opsz24.svg'

interface ArticleHeaderData {
  title: string
  updateDate: string
  releaseDate: string
}

interface ArticleContentData {
  rawText: string
}

interface ArticleData {
  header: ArticleHeaderData
  content: ArticleContentData
}

enum FetchState {
  OK,
  WAIT,
  FAIL,
}

function ArticleHeader({
  title,
  updateDate,
  releaseDate,
}: {
  title: string
  updateDate: string
  releaseDate: string
}): React.ReactNode {
  return (
    <div className="article__header">
      <div className="title">
        <h1>{title}</h1>
        <div className="bar" />
      </div>
      <div className="info">
        <li>
          <p>update date: {updateDate}</p>
          <p>release date: {releaseDate}</p>
          <div className="history">
            <Image src={historyIcon} alt="history" />
            <p>history</p>
          </div>
        </li>
        <li>
          <p>by Contributor</p>
        </li>
        <div className="bar" />
      </div>
    </div>
  )
}

enum ParseState {
  OK,
  WAIT,
  FAIL,
}

function ArticleContent({
  content,
}: {
  content: { rawText: string }
}): React.ReactNode {
  const [textState, setTextState] = useState('')
  const [parseState, setParseState] = useState(ParseState.WAIT)

  const marked = useMemo(() => {
    const m = new Marked(
      { async: true },
      markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
      }),
    )
    m.use(markedKatex({ throwOnError: false }))
    return m
  }, [])

  useEffect(() => {
    const promiseParse = marked.parse(content.rawText) as Promise<string>
    promiseParse
      .then((text) => {
        setTextState(text)
        setParseState(ParseState.OK)
      })
      .catch((e) => {
        setParseState(ParseState.FAIL)
      })
  }, [content, marked])

  if (parseState === ParseState.WAIT) {
    return <div className="content loading">{/* <LoadingOutlined /> */}</div>
  }
  if (parseState === ParseState.FAIL) {
    return <div className="content">Fail to parse raw text</div>
  }
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: textState }} />
}

export default function Article({ url }: { url: string }) {
  const [fetchState, setFetchState] = useState(FetchState.OK)
  const [articleData, setArticleData] = useState<ArticleData>({
    header: { title: '', releaseDate: '', updateDate: '' },
    content: { rawText: '' },
  })

  const fetchArticle = (): void => {
    if (fetchState === FetchState.WAIT) return
    fetch(url)
      .then(async (resp) => resp.json())
      .then((resp) => {
        setArticleData({
          header: {
            title: resp.title,
            releaseDate: resp.releaseDate,
            updateDate: resp.updateDate,
          },
          content: {
            rawText: resp.data,
          },
        })
        setFetchState(FetchState.OK)
      })
      .catch(() => {
        setFetchState(FetchState.FAIL)
      })
  }
  useEffect(() => {
    fetchArticle()
  }, [])

  if (fetchState === FetchState.WAIT) {
    return <div className="loading" />
  }
  if (fetchState === FetchState.FAIL) {
    return (
      <div className="fail">
        <p>Fetch Article Failed</p>
        <br />
        <p>url: {url}</p>
      </div>
    )
  }
  return (
    <div className="article">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
      />
      <ArticleHeader
        title={articleData.header.title}
        releaseDate={articleData.header.releaseDate}
        updateDate={articleData.header.updateDate}
      />
      <ArticleContent content={articleData.content} />
    </div>
  )
}
