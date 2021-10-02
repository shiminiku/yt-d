import Head from "next/head"
import Image from "next/image"
import { useRef, useState } from "react"

import style from "./style.module.scss"
import yt from "./trouble-yt.svg"

function StreamsTable({ streams, decipher, loading, deciphered }) {
  return (
    <div className={style["scroll"]}>
      <table className={style["table-streaming"]}>
        <tbody>
          {streams.map?.((s: any) => {
            let bitrateSuffix = "Kbps"
            let b = s.bitrate / 1000
            if (b / 1000 >= 1) {
              b = b / 1000
              bitrateSuffix = "Mbps"
            }
            let bitrate = b.toFixed(3)

            return (
              <tr key={s.itag}>
                <td className={style["itag-col"]}>{s.itag}</td>
                <td>
                  <code>
                    {s.mimeType.startsWith("video") ? (
                      <>
                        <span className={style["video-mimetype-text"]}>{s.mimeType.slice(0, 5)}</span>
                        {s.mimeType.slice(5)}
                      </>
                    ) : (
                      <>
                        <span className={style["audio-mimetype-text"]}>{s.mimeType.slice(0, 5)}</span>
                        {s.mimeType.slice(5)}
                      </>
                    )}
                  </code>
                </td>
                <td>
                  {s.height ? s.height + "p" : ""}
                  {s.fps ? s.fps + "fps" : <span className={style["gray-text"]}>(audio)</span>}
                </td>
                <td className={style["bitrate-text"]}>
                  {bitrate} {bitrateSuffix}
                </td>
                {s.url ? (
                  <td>
                    <a target="_blank" href={s.url}>
                      Go
                    </a>
                  </td>
                ) : s.signatureCipher ? (
                  <td>
                    {deciphered[s.signatureCipher] ? (
                      <a target="_blank" href={deciphered[s.signatureCipher]}>
                        Go
                      </a>
                    ) : (
                      <button onClick={() => decipher(s.signatureCipher)} disabled={loading}>
                        Get URL
                      </button>
                    )}
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Home() {
  const videoIdInput = useRef<HTMLInputElement>(null)

  const videoId = useRef("")

  const [loading, setLoading] = useState(false)

  const [response, setResponse] = useState<any>(null)
  const [deciphered, setDeciphered] = useState({})

  function getVideo() {
    setLoading(true)

    videoId.current = videoIdInput.current?.value.match(/[0-9a-zA-Z-_]{11}/)?.[0]
    if (!videoId.current) {
      setLoading(false)
      return
    }

    fetch(`/api/video?v=${videoId.current}`)
      .then((v) => v.json())
      .then((v) => {
        setLoading(false)
        setResponse(v)
      })
  }

  function sigToUrl(sc: string) {
    setLoading(true)

    const data = {
      s: decodeURIComponent(sc.match(/s=([^&]*)/)?.[1] ?? ""),
      sp: decodeURIComponent(sc.match(/sp=([^&]*)/)?.[1] ?? ""),
      url: decodeURIComponent(sc.match(/url=([^&]*)/)?.[1] ?? "")
    }

    fetch(`/api/getsig?v=${videoId.current}&s=${data.s}`)
      .then((v) => v.text())
      .then((sig) => {
        setLoading(false)
        setDeciphered((ps) => ({ ...ps, [sc]: `${data.url}&${data.sp}=${sig}` }))
      })
  }

  return (
    <>
      <div className={style["home"]}>
        <Head>
          <title>YT Downloader</title>
        </Head>
        <form
          className={style["form"]}
          onSubmit={(ev) => {
            ev.preventDefault()
            getVideo()
          }}
        >
          <input
            type="text"
            placeholder="URL, videoId (https://www.youtube.com/watch?v=dQw4w9WgXcQ, https://youtu.be/dQw4w9WgXcQ, dQw4w9WgXcQ)"
            autoFocus={true}
            ref={videoIdInput}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            OK
          </button>
        </form>
        {loading && (
          <div className={style["loading"]}>
            <Image src={yt} />
          </div>
        )}
        <div>
          <h2>video details</h2>
          <table className={style["table-details"]}>
            <tbody>
              <tr>
                <th>videoId</th>
                <td>{response?.videoDetails.videoId ?? <span className={style["gray-text"]}>-----</span>}</td>
              </tr>
              <tr>
                <th>title</th>
                <td>{response?.videoDetails.title ?? <span className={style["gray-text"]}>-----</span>}</td>
              </tr>
              <tr>
                <th>author</th>
                <td>{response?.videoDetails.author ?? <span className={style["gray-text"]}>-----</span>}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {response?.streamingData && (
          <>
            <div>
              <h2>Streamings</h2>
              <h3>Both (video and audio)</h3>
              <StreamsTable
                streams={response.streamingData.formats}
                decipher={sigToUrl}
                loading={loading}
                deciphered={deciphered}
              />
              <h3>Separated (Each video or audio)</h3>
              <StreamsTable
                streams={response.streamingData.adaptiveFormats}
                decipher={sigToUrl}
                loading={loading}
                deciphered={deciphered}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
