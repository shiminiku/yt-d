import { PlayerResponse } from "@shiminiku/yt-o"
import style from "./page.module.scss"
import { Expandable } from "../../../components/Expandable"
import { Metadata } from "next"
import { BooleanItem } from "../../../components/BooleanItem"
import { GET_playerResponse } from "../../../lib/yt-dp"

interface SimpleText {
  simpleText: string
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Lens(${(await params).id}) - YT Downloader`,
  }
}

function Inner({ pr }: { pr: PlayerResponse }) {
  const status = pr.playabilityStatus
  const details = pr.videoDetails

  const microformat = pr.microformat?.playerMicroformatRenderer

  return (
    <>
      <p>
        ステータス: {status.status}
        {status.reason && ` (${status.reason})`}, 埋め込み: {status.playableInEmbed ? "可能" : "不可"}
      </p>

      {details && (
        <div>
          <img src={details.thumbnail.thumbnails[0].url} />
          <details>
            <summary>サムネイル一覧</summary>
            <ul className={style.thumbnailsList}>
              {details.thumbnail.thumbnails.map((t, i) => (
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
        </div>
      )}

      {microformat && (
        <div>
          <p>
            <a href={(microformat as any).canonicalUrl} target="_blank" rel="noopener noreferrer">
              {(microformat as any).canonicalUrl}
            </a>
          </p>
          <h2>{(microformat.title as unknown as SimpleText).simpleText}</h2>

          <p className={style.sep}>
            <span>
              <a href={microformat.ownerProfileUrl} target="_blank" rel="noopener noreferrer">
                {microformat.ownerChannelName}
              </a>
            </span>
            <span>{parseInt(microformat.viewCount).toLocaleString()} 回再生</span>
            <span>高評価 {parseInt((microformat as any).likeCount).toLocaleString()}</span>
            <span>{new Date(microformat.publishDate).toLocaleString()} 公開</span>
          </p>

          <Expandable>
            <pre className={style.description}>{(microformat.description as unknown as SimpleText).simpleText}</pre>
          </Expandable>
        </div>
      )}

      {details && microformat && (
        <div>
          <p>アップロード日: {new Date(microformat.uploadDate).toLocaleString()}</p>
          <p className={style.sep}>
            <BooleanItem title="ライブ配信" value={details.isLiveContent} />
            <BooleanItem title="非公開動画" value={details.isPrivate} />
            <BooleanItem title="クロール可能" value={details.isCrawlable} />
          </p>
        </div>
      )}
    </>
  )
}

export default async function LensId({ params }: Props) {
  const { id } = await params
  const { playerResponse: pr } = await GET_playerResponse(id)
  if (!pr) return

  return (
    <>
      <main>
        <h1>
          Lens: <code>{id}</code>
        </h1>

        {pr ? <Inner pr={pr} /> : <p>Error</p>}

        <details>
          <summary>Developer Mode 🔨⛑️</summary>
          <pre className={style.json}>
            <code>{JSON.stringify(pr, null, 2)}</code>
          </pre>
        </details>
      </main>
    </>
  )
}
