import Head from "next/head"
import Image from "next/image"
import { createContext, useRef, useState } from "react"
import { StreamsTable } from "../components/StreamsTable"
import { VideoDetailsTable } from "../components/VideoDetailsTable"

import style from "./style.module.scss"
import yt from "./trouble-yt.svg"

export const LoadingContext = createContext(false)

function fetchVideo(videoId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch(`/api/video?v=${videoId}`)
      .then((v) => v.json())
      .then((v) => resolve(v))
      .catch((r) => reject(r))
  })
}

export default function Top() {
  const videoIdInput = useRef<HTMLInputElement>(null)

  const videoId = useRef("")

  const [loading, setLoading] = useState(false)

  const [response, setResponse] = useState<any>(null)
  const [deciphered, setDeciphered] = useState({})

  function getVideo() {
    setLoading(true)

    videoId.current = videoIdInput.current.value.match(/[0-9a-zA-Z-_]{11}/)?.[0]
    if (!videoId.current) return

    fetchVideo(videoId.current)
      .then((v) => {
        setLoading(false)
        setResponse(v)
      })
      .catch(() => setLoading(false))
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
      <Head>
        <title>YT Downloader</title>
      </Head>
      <div className={style["home"]}>
        <form
          className={style["form"]}
          onSubmit={(ev) => {
            ev.preventDefault()
            getVideo()
          }}
        >
          <input
            type="text"
            placeholder="リンクなど (https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
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
        {!response && <p>上にリンクを入力して「OK」か「Enterキー」を押してください</p>}
        <div className={style["container"]}>
          {response?.videoDetails && (
            <details open>
              <summary>
                <h2 style={{ display: "inline" }}>動画の情報</h2>
              </summary>
              <VideoDetailsTable videoDetails={response.videoDetails} />
            </details>
          )}
          {response?.streamingData && (
            <LoadingContext.Provider value={loading}>
              <div>
                <h2>配信</h2>
                {response.streamingData.formats && (
                  <>
                    <h3>両方 (動画と音声が一体化)</h3>
                    <StreamsTable
                      streams={response.streamingData.formats}
                      decipherFunction={sigToUrl}
                      deciphered={deciphered}
                    />
                  </>
                )}
                {response.streamingData.adaptiveFormats && (
                  <>
                    <h3>分割 (動画と音声がそれぞれで分割)</h3>
                    <StreamsTable
                      streams={response.streamingData.adaptiveFormats}
                      decipherFunction={sigToUrl}
                      deciphered={deciphered}
                    />
                  </>
                )}
              </div>
            </LoadingContext.Provider>
          )}
        </div>
      </div>
    </>
  )
}
