import style from "./page.module.scss"
import { Metadata } from "next"
import { Suspense } from "react"
import RandLoading from "../../../components/RandLoad"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Lens(${(await params).id}) - YT Downloader`,
  }
}

function ThumbnailList({ id, name }: { id: string; name?: string }) {
  return (
    <details>
      <summary>{name ?? "サムネイル一覧"}</summary>
      <ul className={style.thumbnailsList}>
        {[
          { url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, width: 480, height: 360 },
          { url: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, width: 1280, height: 720 },
        ].map((t, i) => (
          <li key={i}>
            <a href={t.url} target="_blank" rel="noopener noreferrer">
              <img src={t.url} loading="lazy" /*  width={t.width} height={t.height} */ />
              <p>
                {t.width} x {t.height}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}

async function fetchMeta(id: string) {
  const resp = await fetch(`https://www.youtube.com/watch?v=${id}`)

  const { JSDOM } = await import("jsdom")
  const dom = new JSDOM(await resp.text())
  const doc = dom.window.document

  const metas = doc.getElementsByTagName("meta")
  const title = metas.namedItem("title")?.content
  const description = metas.namedItem("description")?.content
  const keyword = metas.namedItem("keywords")?.content

  if (!title || !description || !keyword) {
    throw new Error("Meta not found")
  }

  return {
    title,
    description,
    keyword,
  }
}

async function fetchOembed(id: string): Promise<{
  title: string
  author_name: string
  author_url: string
  type: "video"
  height: number
  width: number
  version: "1.0"
  provider_name: "YouTube"
  provider_url: "https://www.youtube.com/"
  thumbnail_height: number
  thumbnail_width: number
  thumbnail_url: string
  html: string
}> {
  const resp = await fetch(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`)
  return await resp.json()
}

export default async function LensId({ params }: Props) {
  const { id } = await params
  let meta
  let oembed
  try {
    meta = await fetchMeta(id)
    oembed = await fetchOembed(id)
  } catch (e) {
    console.error("ErrorLensId", e)
    return (
      <main>
        <h1>
          Lens: <code>{id}</code>
        </h1>
        <p>エラーです。ごめんなさい… ⚠️{(e as Error)?.message ?? "Unknown Error"}</p>
        <ThumbnailList id={id} name="もしかして… サムネイル一覧" />
      </main>
    )
  }

  return (
    <main>
      <h1>
        Lens: <code>{id}</code>
      </h1>

      <Suspense
        fallback={
          <p>
            ロード中… <RandLoading />
          </p>
        }
      >
        <h2>
          <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
            {meta.title}
          </a>
        </h2>
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} />
        <p>
          <a href={oembed.author_url} target="_blank" rel="noopener noreferrer">
            {oembed.author_name}
          </a>
        </p>

        <h2>概要</h2>
        <p>{meta.description}</p>

        <h2>キーワード</h2>
        <p>{meta.keyword}</p>

        <div>
          <ThumbnailList id={id} />
        </div>

        <details>
          <summary>Developer Mode 🔨⛑️</summary>
          <pre className={style.json}>
            <code>{JSON.stringify({ meta, oembed }, null, 2)}</code>
          </pre>
        </details>
      </Suspense>
    </main>
  )
}
