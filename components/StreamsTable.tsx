import { useContext } from "react"
import { DecipheredURLContext, LoadingContext } from "../pages"
import style from "styles/style.module.scss"

export function StreamsTable({ streams, decipherFunction }) {
  const loading = useContext(LoadingContext)
  const deciphered = useContext(DecipheredURLContext)

  return (
    <div className={style["scroll"]}>
      <table className={style["table-streaming"]}>
        <tbody>
          {streams?.map?.((stream: any) => {
            let bitrateSuffix = "Kbps"
            let b = stream.averageBitrate / 1000
            if (b / 1000 >= 1) {
              b = b / 1000
              bitrateSuffix = "Mbps"
            }
            let bitrate = b.toFixed(3)

            return (
              <tr key={stream.itag}>
                <td className={style["itag-col"]}>{stream.itag}</td>
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
                {stream.url ? (
                  <td>
                    <a target="_blank" href={stream.url}>
                      開く
                    </a>
                  </td>
                ) : stream.signatureCipher ? (
                  <td>
                    {deciphered[stream.signatureCipher] ? (
                      <a target="_blank" href={deciphered[stream.signatureCipher]}>
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
