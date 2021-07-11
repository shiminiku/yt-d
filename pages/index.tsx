import Image from "next/image"
import Head from "next/head"
import { useRef, useState } from "react"

import style from "./style.module.scss"
import attackingYT from "./attacking-yt.png"

export default function Home() {
  const videoIdInput = useRef<HTMLInputElement>(null)
  const sigToUrlEl = useRef<HTMLDivElement>(null)
  const sigInput = useRef<HTMLInputElement>(null)

  const videoId = useRef("")

  const [loading, setLoading] = useState(false)

  const [response, setResponse] = useState<any>(null)
  const [sigToUrlResult, setSigToUrlResult] = useState("")

  function getVideoInfo() {
    setLoading(true)

    videoId.current = videoIdInput.current?.value.match(/[0-9a-zA-Z-_]{11}/)?.[0]
    if (!videoId.current) {
      setLoading(false)
      return
    }

    fetch(`/api/watchpbj?v=${videoId.current}`)
      .then((v) => v.json())
      .then((v) => {
        setLoading(false)
        setResponse(v[2].playerResponse)
      })
  }

  function getUrlFromSig(sig: string) {
    setLoading(true)

    let sigObj = {
      s: decodeURIComponent(sig.match(/s=([^&]*)/)?.[1] ?? ""),
      sp: decodeURIComponent(sig.match(/sp=([^&]*)/)?.[1] ?? ""),
      url: decodeURIComponent(sig.match(/url=([^&]*)/)?.[1] ?? ""),
    }

    return new Promise<string>((resolve) =>
      fetch(`/api/getsig?v=${videoId.current}&s=${sigObj.s}`)
        .then((v) => v.text())
        .then((v) => {
          setLoading(false)
          resolve(`${sigObj.url}&${sigObj.sp}=${v}`)
        })
    )
  }

  function copy(text: string) {
    document.addEventListener(
      "copy",
      (ev) => {
        ev.preventDefault()
        ev.clipboardData?.setData("text/plain", text)
      },
      { once: true }
    )
    document.execCommand("copy")
  }

  function sigToUrl(sig: string) {
    if (sigInput.current) {
      sigInput.current.value = sig
      getUrlFromSig(sigInput.current.value).then((v) => {
        setSigToUrlResult(v)
        sigToUrlEl.current.scrollIntoView()
      })
    }
  }

  return (
    <>
      <Head>
        <title>YT Downloader</title>
      </Head>
      <form
        className={style["fit-form"]}
        onSubmit={(ev) => {
          ev.preventDefault()
          getVideoInfo()
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
        {loading && <Image src={attackingYT} width={16} height={16}></Image>}
      </form>
      <div>
        <h2 className={style["no-margin"]}>video details</h2>
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
      <div>
        <h2 className={style["no-margin"]}>streaming data</h2>
        <h3 className={style["no-margin"]}>formats</h3>
        <table className={style["table-streaming"]}>
          <tbody>
            {response?.streamingData?.formats?.map?.((v: any) => (
              <tr key={v.itag}>
                <td className={style["itag-col"]}>{v.itag}</td>
                <td>
                  <code>{v.mimeType}</code>
                </td>
                <td>
                  {v.height ? v.height + "p" : ""}{" "}
                  {v.fps ? v.fps + "fps" : <span className={style["gray-text"]}>(audio)</span>}
                </td>
                <td>{v.bitrate / 1000} kbps</td>
                {v.url && (
                  <td>
                    <button onClick={() => copy(v.url)}>Copy URL</button>
                  </td>
                )}
                {v.signatureCipher && (
                  <td>
                    <button onClick={() => sigToUrl(v.signatureCipher)}>Get URL</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className={style["no-margin"]}>adaptive formats</h3>
        <table className={style["table-streaming"]}>
          <tbody>
            {response?.streamingData?.adaptiveFormats?.map?.((v: any) => (
              <tr key={v.itag}>
                <td className={style["itag-col"]}>{v.itag}</td>
                <td>
                  <code>
                    {v.mimeType.startsWith("video") ? (
                      <>
                        <span className={style["video-mimetype-text"]}>{v.mimeType.slice(0, 5)}</span>
                        {v.mimeType.slice(5)}
                      </>
                    ) : (
                      <>
                        <span className={style["audio-mimetype-text"]}>{v.mimeType.slice(0, 5)}</span>
                        {v.mimeType.slice(5)}
                      </>
                    )}
                  </code>
                </td>
                <td>
                  {v.height ? v.height + "p" : ""}{" "}
                  {v.fps ? v.fps + "fps" : <span className={style["gray-text"]}>(audio)</span>}
                </td>
                <td>{v.bitrate / 1000} kbps</td>
                {v.url && (
                  <td>
                    <button onClick={() => copy(v.url)}>Copy URL</button>
                  </td>
                )}
                {v.signatureCipher && (
                  <td>
                    <button onClick={() => sigToUrl(v.signatureCipher)}>Get URL</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={sigToUrlEl}>
        <h2 className={style["no-margin"]}>signatureCipher to URL</h2>
        <form
          className={style["fit-form"]}
          onSubmit={(ev) => {
            ev.preventDefault()
            if (sigInput.current?.value) {
              getUrlFromSig(sigInput.current?.value).then((v) => {
                setSigToUrlResult(v)
              })
            }
          }}
        >
          <input ref={sigInput} type="text" disabled={loading} />
          <button type="submit" disabled={loading}>
            OK
          </button>
          {loading && <Image src={attackingYT} width={16} height={16}></Image>}
        </form>
        {sigToUrlResult && (
          <div>
            <a className={style["wrap"]} target="_blank" href={sigToUrlResult}>
              {sigToUrlResult.slice(0, 50)}...
            </a>
          </div>
        )}
      </div>
    </>
  )
}
