import { ReactNode, useMemo } from "react"
import { AdFormat, Format } from "../lib/yt-dp"
import { URLCache } from "../app/page"
import { BaseFormat } from "@shiminiku/yt-o"
import style from "/styles/UsefulFormats.module.scss"
import { HelpButton } from "../lib/Helps"
import RandLoading from "./RandLoad"

function DownloadBtn({ href, download, children }: { href?: string; download?: string; children: ReactNode }) {
  return (
    <a target="_blank" href={href} download={download} className={style.downloadBtn}>
      {children}
    </a>
  )
}

function findHQ(fmt: (Format | AdFormat)[], type: string): Format | AdFormat {
  const filtered = [...fmt]
    .sort((a, b) => (b.averageBitrate ?? b.bitrate) - (a.averageBitrate ?? a.bitrate))
    .filter((f) => f.mimeType.includes(type))
  return filtered[0]
}

function urlFromCache(fmt: BaseFormat, urlCache: URLCache): string | undefined {
  if (fmt.url) return urlCache[fmt.url]
  else if (fmt.signatureCipher) return urlCache[fmt.signatureCipher]
  else return undefined
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
  const _av = useMemo(() => findHQ(formats, "video"), [formats]) // audio-video.mp4

  const _video = useMemo(() => findHQ(adFormats, "video"), [adFormats]) // video.mp4
  const _audio = useMemo(() => findHQ(adFormats, "audio"), [adFormats]) // audio.m4a

  const _mp4264 = useMemo(() => findHQ(adFormats, "avc1"), [adFormats]) // h264.mp4
  const _mp4av1 = useMemo(() => findHQ(adFormats, "av01"), [adFormats]) // av1.mp4
  const _webm_vp9 = useMemo(() => findHQ(adFormats, "vp9"), [adFormats]) // vp9.webm

  const _m4a_aac = useMemo(() => findHQ(adFormats, "mp4a"), [adFormats]) // aac.m4a
  const _webm_opus = useMemo(() => findHQ(adFormats, "opus"), [adFormats]) // opus.webm

  const av = urlFromCache(_av, urlCache)
  const video = urlFromCache(_video, urlCache)
  const audio = urlFromCache(_audio, urlCache)
  const mp4264 = urlFromCache(_mp4264, urlCache)
  const mp4av1 = urlFromCache(_mp4av1, urlCache)
  const webm_vp9 = urlFromCache(_webm_vp9, urlCache)
  const m4a_aac = urlFromCache(_m4a_aac, urlCache)
  const webm_opus = urlFromCache(_webm_opus, urlCache)

  return (
    <section>
      <h3>
        最高画質でダウンロード
        <HelpButton helpKey="downloading">?</HelpButton>
      </h3>
      <p>新しくタブが開く場合は、開いたタブから[ダウンロード]してください</p>

      <p>
        <DownloadBtn href={av}>
          映像 + 音声 (低画質) {(av === undefined || av.length === 0) && <RandLoading />}
        </DownloadBtn>
      </p>
      <p>
        <DownloadBtn href={video}>
          映像 (最高ビットレート) {(video === undefined || video.length === 0) && <RandLoading />}
        </DownloadBtn>
        <DownloadBtn href={audio}>
          音声 (最高ビットレート) {(audio === undefined || audio.length === 0) && <RandLoading />}
        </DownloadBtn>
      </p>
      <p>
        <DownloadBtn href={mp4264}>
          .mp4 (H.264) {(mp4264 === undefined || mp4264.length === 0) && <RandLoading />}
        </DownloadBtn>
        <DownloadBtn href={mp4av1}>
          .mp4 (AV1) {(mp4av1 === undefined || mp4av1.length === 0) && <RandLoading />}
        </DownloadBtn>
        <DownloadBtn href={webm_vp9}>
          .webm (VP9) {(webm_vp9 === undefined || webm_vp9.length === 0) && <RandLoading />}
        </DownloadBtn>
      </p>
      <p>
        <DownloadBtn href={m4a_aac}>
          .m4a (AAC) {(m4a_aac === undefined || m4a_aac.length === 0) && <RandLoading />}
        </DownloadBtn>
        <DownloadBtn href={webm_opus}>
          .webm (Opus) {(webm_opus === undefined || webm_opus.length === 0) && <RandLoading />}
        </DownloadBtn>
      </p>
    </section>
  )
}
