import { useContext } from "react"
import style from "/styles/StreamsTable.module.scss"
import { StoreContext } from "./Main"
import { HELPS } from "../lib/Help"

export function StreamsTable({ streams, decipherFunction, showHelp }) {
  const { loading, deciphered } = useContext(StoreContext)

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
          {streams?.map?.((stream: any) => {
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
              <tr key={stream.itag}>
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
                  {stream.fps ? stream.fps + "fps" : <span className={style["gray-text"]}>(音声)</span>}
                </td>
                <td className={style["bitrate-text"]}>
                  {bitrate} {bitrateSuffix}
                </td>
                <td className={style["bitrate-text"]}>
                  {length} {lenSuffix}
                </td>
                {stream.url ? (
                  <td>
                    <a target="_blank" href={stream.url} rel="noreferrer">
                      開く
                    </a>
                  </td>
                ) : stream.signatureCipher ? (
                  <td>
                    {deciphered[stream.signatureCipher] ? (
                      <a target="_blank" href={deciphered[stream.signatureCipher]} rel="noreferrer">
                        開く
                      </a>
                    ) : (
                      <button onClick={() => decipherFunction(stream.signatureCipher)} disabled={loading}>
                        リンクを取得
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
