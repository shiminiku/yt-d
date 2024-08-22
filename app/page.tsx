"use client"

import { useCallback, useRef, useState } from "react"
import style from "./page.module.scss"
import { GET_watch, sigCodeJSsrc } from "../lib/yt-dp"
import { VideoDetails } from "../components/VideoDetailsTable"
import Image from "next/image"

import yt from "/public/trouble-yt.svg"
import { StreamsTable } from "../components/StreamsTable"
import { Help, HELPS } from "../lib/Helps"

export interface URLCache {
  [x: string]: string
}

export default function Home() {
  const [[isLoading, loadReason], updateStatus] = useState<[boolean, string | undefined]>([false, undefined])

  const helpDialog = useRef<HTMLDialogElement>(null)
  const [help, setHelp] = useState<Help | undefined>()
  const showHelp = useCallback((help: Help) => {
    setHelp(help)
    helpDialog.current?.showModal()
  }, [])

  const formInput = useRef<HTMLInputElement>(null)
  const [videoId, setVideoId] = useState<string>()
  // prog poem: null means "none in now", undefined means "initially none"

  const [pr, setPR] = useState<any>()
  const [baseJsUrl, setBaseJsUrl] = useState<string>()

  const [urlCache, updateURLCache] = useState({})

  const sd = pr?.streamingData
  const formats = sd?.formats
  const adFormats = sd?.adaptiveFormats

  return (
    <>
      <form
        className={style.form}
        onSubmit={async (ev) => {
          ev.preventDefault()
          const _id = formInput.current?.value
          const id = _id?.match(/[0-9a-zA-Z-_]{11}/)?.[0]

          if (id) {
            setVideoId(id)

            updateStatus([true, "動画情報を取得中…"])

            GET_watch(id)
              .then((pr) => {
                setPR(pr.playerResponse)
                setBaseJsUrl(pr.basejsURL)
              })
              .catch((e) => {
                console.warn("IDForm:submit::GetVideo", e)
              })
              .finally(() => {
                updateStatus([false, undefined])
              })
          }
        }}
      >
        <input
          type="text"
          placeholder="リンク、動画ID (jNQXAC9IVRw, https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
          autoFocus={true}
          ref={formInput}
        />
        <button type="submit" disabled={isLoading}>
          OK
        </button>
      </form>

      {!pr && (
        <center>
          <p>上にリンクを入力して「OK」か「Enterキー」を押してください</p>
        </center>
      )}

      {pr && (
        <div className={style.splitter}>
          <VideoDetails videoDetails={pr?.videoDetails} />

          {sd ? (
            <div>
              <h2>配信</h2>

              <h3>
                両方 (動画と音声が一体化)
                <button className={style.helpBtn} onClick={() => showHelp(HELPS.bothFormats)}>
                  ?
                </button>
              </h3>
              {formats && (
                <StreamsTable
                  streams={formats}
                  urlCache={urlCache}
                  updateCache={updateURLCache}
                  showHelp={showHelp}
                  radioId="fmt"
                />
              )}

              <h3 className={style.mTop}>
                分割 (動画と音声がそれぞれで分割)
                <button className={style.helpBtn} onClick={() => showHelp(HELPS.adaptiveFormats)}>
                  ?
                </button>
              </h3>
              {adFormats && (
                <StreamsTable
                  streams={adFormats}
                  urlCache={urlCache}
                  updateCache={updateURLCache}
                  showHelp={showHelp}
                  radioId="adFmt"
                />
              )}
            </div>
          ) : (
            <h2>配信情報が見つかりませんでした</h2>
          )}
        </div>
      )}

      <footer className={style.footer + " full"}>
        <p>
          GitHub <a href="https://github.com/shiminiku/yt-d">shiminiku/yt-d</a>
        </p>
      </footer>

      <dialog
        ref={helpDialog}
        style={{ margin: "auto" }}
        onClick={(ev) => {
          const target = ev.target as HTMLElement
          if (!target.closest("container")) helpDialog.current?.close()
        }}
      >
        <div id="container">
          <h2>{help?.title || "おれ、ヘルプ♪"}</h2>
          {help?.body.map((v, i) => <p key={i}>{v}</p>) || <p>おれ、教えるよ♪ おれ、ねこじゃない～♪ おれ、ヘルプ♪</p>}
          <form method="dialog">
            <button>閉じる</button>
          </form>
        </div>
      </dialog>

      {isLoading && (
        <div className={style.loadScreen + " full"}>
          <Image src={yt} alt="読込中…" />
          <p>{loadReason || "よみこみちゅうだよ～ (´・ω・｀)"}</p>
        </div>
      )}

      <script defer type="module" src={baseJsUrl && sigCodeJSsrc(baseJsUrl)}></script>
    </>
  )
}
