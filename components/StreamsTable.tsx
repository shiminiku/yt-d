import { useContext } from "react"
import style from "/styles/StreamsTable.module.scss"
import { StoreContext } from "./Main"
import { HELPS } from "../lib/Help"

function downloadLink(stream: any, urlscs: { [x: string]: string }, geturl: any, getsig: any, loading: boolean) {
  if (stream.url && urlscs[stream.url]) {
    return (
      <a target="_blank" href={urlscs[stream.url]} rel="noreferrer">
        開く
      </a>
    )
  } else if (stream.url) {
    return (
      <button onClick={() => geturl(stream.url)} disabled={loading}>
        リンクを取得
      </button>
    )
  } else if (stream.signatureCipher && urlscs[stream.signatureCipher]) {
    return (
      <a target="_blank" href={urlscs[stream.signatureCipher]} rel="noreferrer">
        開く
      </a>
    )
  } else if (stream.signatureCipher) {
    return (
      <button onClick={() => getsig(stream.signatureCipher)} disabled={loading}>
        リンクを取得
      </button>
    )
  }

  return null
}

export function StreamsTable({ streams, geturl, getsig, showHelp }) {
  const { loading, urlscs } = useContext(StoreContext)

  return (
    <div className={style["overflow-scroll"]}>
      <table className={style["table-streaming"]}>
        <tbody>
          <tr>
            <th>
              <abbr title="おそらく、内部的に使われている形式の識別子またはタグ">itag</abbr>
            </th>
            <th>
              MIMEタイプ
              <button className={style["help-btn"]} onClick={() => showHelp(HELPS.mimeType)}>
                ?
              </button>
            </th>
            <th>画質</th>
            <th>ビットレート</th>
            <th>サイズ</th>
            <th>リンク</th>
          </tr>
          {streams?.map?.((stream: any, i: number) => {
            let bitrateSuffix = "Kbps"
            let b = stream.averageBitrate / 1000
            if (b / 1000 >= 1) {
              b = b / 1000
              bitrateSuffix = "Mbps"
            }
            let bitrate = b.toFixed(3)

            let lenSuffix = ""
            let len = parseInt(stream.contentLength)
            if (len / 1000 >= 1) {
              len /= 1000
              lenSuffix = "KB"

              if (len / 1000 >= 1) {
                len /= 1000
                lenSuffix = "MB"
              }
            }
            const length = len.toFixed(2)

            return (
              <tr key={i}>
                <td>{stream.itag}</td>
                <td>
                  <code>
                    {stream.mimeType.startsWith("video") ? (
                      <>
                        <span className={style["video-mimetype-text"]}>{stream.mimeType.slice(0, 5)}</span>
                        {stream.mimeType.slice(5)}
                      </>
                    ) : (
                      <>
                        <span className={style["audio-mimetype-text"]}>{stream.mimeType.slice(0, 5)}</span>
                        {stream.mimeType.slice(5)}
                      </>
                    )}
                  </code>
                </td>
                <td>
                  {stream.height ? stream.height + "p" : ""}
                  {stream.fps ? (
                    stream.fps + "fps"
                  ) : (
                    <span className={style["gray-text"]}>
                      {stream.isDrc ? (
                        <abbr title="Dynamic range compression (ダイナミックレンジ圧縮)">DRC</abbr>
                      ) : (
                        "(音声)"
                      )}
                    </span>
                  )}
                </td>
                <td className={style["bitrate-text"]}>
                  {bitrate} {bitrateSuffix}
                </td>
                <td className={style["bitrate-text"]}>
                  {length} {lenSuffix}
                </td>
                <td>{downloadLink(stream, urlscs, geturl, getsig, loading)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
