'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import markedKatex from 'marked-katex-extension'
import markedFootnote from 'marked-footnote'
import { markedSmartypants } from 'marked-smartypants'
import markedAlert from 'marked-alert'

interface ArticleData {
  content: string
}

enum FetchState {
  OK,
  WAIT,
  FAIL,
}

enum ParseState {
  OK,
  WAIT,
  FAIL,
}

function ArticleContent({ data }: { data: ArticleData }): React.ReactNode {
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
      markedFootnote(),
      markedSmartypants(),
      markedAlert(),
    )
    m.use(markedKatex({ throwOnError: false }))
    return m
  }, [])

  useEffect(() => {
    const promiseParse = marked.parse(data.content) as Promise<string>
    promiseParse
      .then((text) => {
        setTextState(text)
        setParseState(ParseState.OK)
      })
      .catch((e) => {
        setParseState(ParseState.FAIL)
      })
  }, [data, marked])

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
    content: '',
  })

  const fetchArticle = useCallback(() => {
    if (fetchState === FetchState.WAIT) return
    fetch(url)
      .then(async (resp) => resp.json())
      .then((resp) => {
        setArticleData({
          content: resp.content,
        })
        setFetchState(FetchState.OK)
      })
      .catch(() => {
        setFetchState(FetchState.FAIL)
      })
  }, [url, fetchState])

  useEffect(() => {
    fetchArticle()
  }, [fetchArticle])

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
      <ArticleContent data={articleData} />
    </div>
  )
}
