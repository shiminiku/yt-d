import { useMemo, useState } from "react"
import { URLCache } from "../app/page"
import { Help, HelpButton } from "../lib/Helps"
import { BaseFormat, MiniFormat } from "@shiminiku/yt-o"
import style from "/styles/StreamsTable.module.scss"
import { AdFormat, Format } from "../lib/yt-dp"
import { FormatFilters, formatsFilter } from "./FormatFilters"

type CacheUpdater = React.Dispatch<React.SetStateAction<URLCache>>

function genFmtURL(f: MiniFormat, updateCache: CacheUpdater) {
  const yt_dp = (window as any).yt_dp
  let url = f.url
  if (f.signatureCipher) {
    const sc = new URLSearchParams(f.signatureCipher)
    const s = sc.get("s")
    const sp = sc.get("sp")
    url = sc.get("url") || undefined

    const deS = yt_dp.deSC(s)

    url += `&${sp}=${deS}`
  }

  if (!url) return

  const pUrl = new URL(url)
  const nt = pUrl.searchParams.get("n")
  const deNT = yt_dp.getNToken(nt)
  pUrl.searchParams.set("n", deNT)

  updateCache((pv) => ({ ...pv, [f.url || f.signatureCipher || ""]: pUrl.toString() }))
}

function DownloadLink({ f, urlCache, updateCache }: { f: MiniFormat; urlCache: URLCache; updateCache: CacheUpdater }) {
  if (f.url && urlCache[f.url]) {
    return (
      <a target="_blank" href={urlCache[f.url]} rel="noreferrer">
        開く
      </a>
    )
  } else if (f.signatureCipher && urlCache[f.signatureCipher]) {
    return (
      <a target="_blank" href={urlCache[f.signatureCipher]} rel="noreferrer">
        開く
      </a>
    )
  } else {
    const tryLoop = () => {
      try {
        genFmtURL(f, updateCache)
      } catch {
        setTimeout(tryLoop, 1000)
      }
    }
    setTimeout(tryLoop, 0)
    return "取得中…"
  }
}

const CODECS = {
  avc1: "H.264",
  mp4a: "AAC",
  av01: "AV1",
  vp9: "VP9",
  opus: "Opus",
}
function convertCodecName(codec: string) {
  if (codec in CODECS) {
    return CODECS[codec as keyof typeof CODECS]
  } else {
    return codec
  }
}

function getPrePeriod(str: string) {
  const index = str.indexOf(".")
  return index !== -1 ? str.slice(0, index) : str
}

function FormatRow({ fmt, urlCache, updateCache }: { fmt: BaseFormat; urlCache: URLCache; updateCache: CacheUpdater }) {
  let bitrateSuffix = "Kbps"
  let b = (fmt.averageBitrate ?? fmt.bitrate) / 1000
  if (b / 1000 >= 1) {
    b = b / 1000
    bitrateSuffix = "Mbps"
  }

  let lenSuffix = ""
  let len = parseInt(fmt.contentLength)
  if (len / 1000 >= 1) {
    len /= 1000
    lenSuffix = "KB"

    if (len / 1000 >= 1) {
      len /= 1000
      lenSuffix = "MB"
    }
  }

  const mimeType = fmt.mimeType.match(/(\w+\/\w+);\s?codecs="([^,"]+)(?:"|, ([^,"]+)")/)
  const [_, type, codec0, codec1] = mimeType ?? []

  const video = fmt as Format
  const fmtAny = fmt as any

  return (
    <tr>
      {/* itag */}
      <td>{fmt.itag}</td>
      {/* type */}
      <td>
        <code title={fmt.mimeType}>
          {mimeType ? (
            <>
              <span className={style[type.startsWith("video") ? "video-mimetype-text" : "audio-mimetype-text"]}>
                {type.slice(0, 5)}
              </span>
              {type.slice(5)}{" "}
              {codec0 && (
                <span>
                  [{convertCodecName(getPrePeriod(codec0))}
                  {codec1 && "," + convertCodecName(getPrePeriod(codec1))}]
                </span>
              )}
            </>
          ) : (
            "(なし)"
          )}
        </code>
      </td>
      {/* resolution fps */}
      <td className={style.videoQuality}>
        {video.height ? video.height + "p" : ""}
        {video.fps ? (
          video.fps + "fps"
        ) : (
          <span className={style["gray-text"]}>
            {fmtAny.isDrc ? <abbr title="Dynamic range compression (ダイナミックレンジ圧縮)">DRC</abbr> : "(音声)"}
          </span>
        )}
      </td>
      {/* bitrate */}
      <td className={style.bytesText}>{Number.isNaN(b) ? "-" : `${b.toFixed(3)} ${bitrateSuffix}`}</td>
      {/* content size */}
      <td className={style.bytesText}>{Number.isNaN(len) ? "-" : `${len.toFixed(2)} ${lenSuffix}`}</td>
      {/* link */}
      <td>
        <DownloadLink f={fmt} urlCache={urlCache} updateCache={updateCache} />
      </td>
    </tr>
  )
}

export function StreamsTable({
  formats,
  adFormats,
  urlCache,
  updateCache,
}: {
  formats: Format[]
  adFormats: AdFormat[]
  urlCache: URLCache
  updateCache: CacheUpdater
}) {
  const [filterId, setFilter] = useState<number | null>(null)

  const filterFormats = useMemo(() => formats.filter(formatsFilter(filterId)), [formats, filterId])
  const filterAdFormats = useMemo(() => adFormats.filter(formatsFilter(filterId)), [adFormats, filterId])

  return (
    <section className={style.formatsList}>
      <FormatFilters radioId="both" selected={filterId} setSelected={setFilter} />

      <div className={style["overflow-scroll"]}>
        <table className={style["table-streaming"]}>
          <tbody>
            <tr>
              <th>
                <abbr title="おそらく、内部的に使われている形式の識別子またはタグ">itag</abbr>
              </th>
              <th>
                フォーマット
                <HelpButton helpKey="mimeType">?</HelpButton>
              </th>
              <th>画質</th>
              <th>ビットレート</th>
              <th>サイズ</th>
              <th>リンク</th>
            </tr>
            {filterFormats.length > 0 &&
              filterFormats.map((fmt, i) => (
                <FormatRow key={i} fmt={fmt} urlCache={urlCache} updateCache={updateCache} />
              ))}
            {filterFormats.length === 0 && filterAdFormats.length === 0 ? (
              <tr>
                <td></td>
                <td>指定の条件では見つかりませんでした</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ) : (
              <tr className={style.emptyRow}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
            {filterAdFormats.length > 0 &&
              filterAdFormats.map((fmt, i) => (
                <FormatRow key={i} fmt={fmt} urlCache={urlCache} updateCache={updateCache} />
              ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
