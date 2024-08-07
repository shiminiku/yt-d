import Image from "next/image"
import { createContext, useCallback, useRef, useState } from "react"
import yt from "/public/trouble-yt.svg"
import style from "/styles/Main.module.scss"
import { VideoDetails } from "./VideoDetailsTable"
import { StreamsTable } from "./StreamsTable"
import { Help, HELPS } from "../lib/Help"
import { APIResp_video } from "../pages/api/video"

export const StoreContext = createContext<{
  loading: boolean
  urlscs: { [key: string]: string }
}>({
  loading: false,
  urlscs: {},
})

function fetchVideo(videoId: string): Promise<any> {
  if ("ytdDirectFetch" in window) return (window["ytdDirectFetch"] as any)(videoId)
  else
    return new Promise((resolve, reject) => {
      fetch(`/api/video?v=${videoId}`)
        .then((v) => v.json())
        .then((v) => resolve(v))
        .catch((r) => reject(r))
    })
}

export default function Main() {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState<string | null>(null)
  const [response, setResponse] = useState<APIResp_video | null>(null)
  const [urlscs, seturlscs] = useState<{ [key: string]: string }>({})
  const videoIdInput = useRef<HTMLInputElement>()
  const videoId = useRef<string>(null)
  const helpDialog = useRef<HTMLDialogElement>()
  const [help, setHelp] = useState<Help | null>(null)

  const getVideo = useCallback(() => {
    videoId.current = videoIdInput.current.value.match(/[0-9a-zA-Z-_]{11}/)?.[0]
    if (!videoId.current) return

    setLoadingText("動画の情報を取得中…")
    setLoading(true)
    setResponse(null)

    fetchVideo(videoId.current)
      .then((v) => {
        setLoading(false)
        setLoadingText(null)
        setResponse(v)
      })
      .catch(() => {
        setLoading(false)
        setLoadingText(null)
      })
  }, [])

  const getURL = useCallback(
    (url: string) => {
      setLoadingText("リンクを取得中…")
      setLoading(true)

      fetch(
        `/api/geturl?v=${videoId.current}&url=${encodeURIComponent(url)}&basejs=${encodeURIComponent(
          response.basejsURL
        )}`
      )
        .then((v) => v.text())
        .then((v) => {
          setLoadingText(null)
          setLoading(false)
          seturlscs((ps) => ({ ...ps, [url]: v }))
        })
    },
    [response]
  )
  const getSCURL = useCallback(
    (sc: string) => {
      setLoadingText("署名済みリンクを取得中…")
      setLoading(true)

      fetch(
        `/api/getsig?v=${videoId.current}&sc=${encodeURIComponent(sc)}&basejs=${encodeURIComponent(response.basejsURL)}`
      )
        .then((v) => v.text())
        .then((v) => {
          setLoadingText(null)
          setLoading(false)
          seturlscs((ps) => ({ ...ps, [sc]: v }))
        })
    },
    [response]
  )

  const showHelp = useCallback((help: Help) => {
    setHelp(help)
    helpDialog.current.showModal()
  }, [])

  const streamingData = response?.playerResponse.streamingData
  const formats = streamingData?.formats
  const adaptiveFormats = streamingData?.adaptiveFormats

  return (
    <>
      {loading && (
        <div className={style["loading"]}>
          <Image src={yt} alt="loading" />
          <p>{loadingText}</p>
        </div>
      )}

      <h2>
        <center>利用できない状態になってしまい、申し訳ありません。修正は難しいと考えています。</center>
      </h2>

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

      <div className={style["result-container"]}>
        {!response && <p>上にリンクを入力して「OK」か「Enterキー」を押してください</p>}
        <VideoDetails response={response?.playerResponse} />
        {response &&
          (streamingData ? (
            <StoreContext.Provider value={{ loading, urlscs }}>
              <div>
                <h2>配信</h2>
                {formats && (
                  <>
                    <h3>
                      両方 (動画と音声が一体化)
                      <button className={style["help-btn"]} onClick={() => showHelp(HELPS.bothFormats)}>
                        ?
                      </button>
                    </h3>
                    <StreamsTable streams={formats} geturl={getURL} getsig={getSCURL} showHelp={showHelp} />
                  </>
                )}
                {adaptiveFormats && (
                  <>
                    <h3>
                      分割 (動画と音声がそれぞれで分割)
                      <button className={style["help-btn"]} onClick={() => showHelp(HELPS.adaptiveFormats)}>
                        ?
                      </button>
                    </h3>
                    <StreamsTable streams={adaptiveFormats} geturl={getURL} getsig={getSCURL} showHelp={showHelp} />
                  </>
                )}
              </div>
            </StoreContext.Provider>
          ) : (
            <div>
              <h2>配信情報が見つかりませんでした</h2>
            </div>
          ))}
      </div>

      <dialog
        ref={helpDialog}
        onClick={(e) => {
          const target = e.target as HTMLDialogElement

          if (target.tagName !== "DIALOG")
            //This prevents issues with forms
            return

          const rect = target.getBoundingClientRect()

          const clickedInDialog =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width

          if (clickedInDialog === false) target.close()
        }}
      >
        <h2>{help?.title}</h2>
        {help?.body.map((v, i) => (
          <p key={i}>{v}</p>
        ))}
        <form method="dialog">
          <button>閉じる</button>
        </form>
      </dialog>
    </>
  )
}
