import { useMemo } from "react"
import style from "/styles/VideoDetailsTable.module.scss"

function toDurationString(s: number) {
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s - hours * 3600) / 60)
  const seconds = s - hours * 3600 - minutes * 60

  let str = []
  if (hours) {
    str.push(hours.toString().padStart(2, "0"))
    str.push(minutes.toString().padStart(2, "0"))
  } else {
    str.push(minutes.toString().padStart(2, "0"))
  }
  str.push(seconds.toString().padStart(2, "0"))

  return str.join(":")
}

export function VideoDetailsTable({ response }) {
  if (!response) return <div className={style["video-details"]}></div>
  const { videoDetails } = response

  const res = useMemo(() => {
    const r = structuredClone(response)
    Object.keys(r).forEach((key) => {
      if (!["playabilityStatus", "streamingData", "captions", "videoDetails"].includes(key)) delete r[key]
    })
    return r
  }, [response])

  return (
    <div className={style["video-details"]}>
      <details open>
        <summary>
          <h2 style={{ display: "inline" }}>動画の情報</h2>
        </summary>
        <table className={style["table-details"]}>
          <tbody>
            <tr>
              <th>動画ID</th>
              <td>{videoDetails.videoId}</td>
            </tr>
            <tr>
              <th>タイトル</th>
              <td>{videoDetails.title}</td>
            </tr>
            <tr>
              <th>投稿者</th>
              <td>{videoDetails.author}</td>
            </tr>
            <tr>
              <th>動画時間</th>
              <td>{toDurationString(videoDetails.lengthSeconds)}</td>
            </tr>
          </tbody>
        </table>
        <div className={style["thumbnail-container"]}>
          {videoDetails.thumbnail?.thumbnails && (
            <img
              className={style["thumbnail"]}
              src={videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url}
            />
          )}
        </div>
        <details>
          <summary>
            <h3 style={{ display: "inline" }}>more technical info</h3>
          </summary>
          <textarea readOnly value={JSON.stringify(res, null, 2)} wrap="off"></textarea>
        </details>
      </details>
    </div>
  )
}
