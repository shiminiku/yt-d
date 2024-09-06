import { ReactNode, useMemo } from "react"
import { AdFormat, Format } from "../lib/yt-dp"
import { URLCache } from "../app/page"
import { BaseFormat } from "@shiminiku/yt-o"
import style from "/styles/UsefulFormats.module.scss"
import { HelpButton } from "../lib/Helps"

function DownloadBtn({ href, download, children }: { href?: string; download?: string; children: ReactNode }) {
  return (
    <a target="_blank" href={href} download={download} className={style.downloadBtn}>
      {children}
    </a>
  )
}

function findHQ(fmt: (Format | AdFormat)[], type: string, fromZero: boolean = true): Format | AdFormat {
  const filtered = [...fmt]
    .sort((a, b) => (b.averageBitrate ?? b.bitrate) - (a.averageBitrate ?? a.bitrate))
    .filter((f) => f.mimeType.includes(type))
  console.log(
    "wan",
    filtered.map((f) => f.bitrate)
  )
  return filtered[0]
}

function urlFromCache(fmt: BaseFormat, urlCache: URLCache): string {
  if (fmt.url) return urlCache[fmt.url]
  else if (fmt.signatureCipher) return urlCache[fmt.signatureCipher]
  else return ""
}

export function UsefulFormats({
  formats,
  adFormats,
  urlCache,
}: {
  formats: Format[]
  adFormats: AdFormat[]
  urlCache: URLCache
}) {
  const av = useMemo(() => findHQ(formats, "video", false), [formats]) // audio-video.mp4

  const video = useMemo(() => findHQ(adFormats, "video"), [adFormats]) // video.mp4
  const audio = useMemo(() => findHQ(adFormats, "audio"), [adFormats]) // audio.m4a

  const mp4264 = useMemo(() => findHQ(adFormats, "avc1"), [adFormats]) // h264.mp4
  const mp4av1 = useMemo(() => findHQ(adFormats, "av01"), [adFormats]) // av1.mp4
  const webm_vp9 = useMemo(() => findHQ(adFormats, "vp9"), [adFormats]) // vp9.webm

  const m4a_aac = useMemo(() => findHQ(adFormats, "mp4a"), [adFormats]) // aac.m4a
  const webm_opus = useMemo(() => findHQ(adFormats, "opus"), [adFormats]) // opus.webm

  return (
    <section>
      <h3>
        最高画質でダウンロード
        <HelpButton helpKey="downloading">?</HelpButton>
      </h3>
      <p>新しくタブが開く場合は、開いたタブから[ダウンロード]してください</p>

      <p>
        <DownloadBtn href={av ? urlFromCache(av, urlCache) : undefined}>映像 + 音声 (低画質)</DownloadBtn>
      </p>
      <p>
        <DownloadBtn href={video ? urlFromCache(video, urlCache) : undefined}>映像 (最高ビットレート)</DownloadBtn>
        <DownloadBtn href={audio ? urlFromCache(audio, urlCache) : undefined}>音声 (最高ビットレート)</DownloadBtn>
      </p>
      <p>
        <DownloadBtn href={mp4264 ? urlFromCache(mp4264, urlCache) : undefined}>.mp4 (H.264)</DownloadBtn>
        <DownloadBtn href={mp4av1 ? urlFromCache(mp4av1, urlCache) : undefined}>.mp4 (AV1)</DownloadBtn>
        <DownloadBtn href={webm_vp9 ? urlFromCache(webm_vp9, urlCache) : undefined}>.webm (VP9)</DownloadBtn>
      </p>
      <p>
        <DownloadBtn href={m4a_aac ? urlFromCache(m4a_aac, urlCache) : undefined}>.m4a (AAC)</DownloadBtn>
        <DownloadBtn href={webm_opus ? urlFromCache(webm_opus, urlCache) : undefined}>.webm (Opus)</DownloadBtn>
      </p>
    </section>
  )
}
