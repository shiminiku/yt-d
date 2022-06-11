import { useMemo } from "react"
import style from "/styles/VideoDetails.module.scss"

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

export function VideoDetails({ response }) {
  const res = useMemo(() => {
    if (!response) return null
    const r = structuredClone(response)
    Object.keys(r).forEach((key) => {
      if (!["playabilityStatus", "streamingData", "captions", "videoDetails"].includes(key)) delete r[key]
    })
    return r
  }, [response])

  if (!response) return <div className={style["video-details"]}></div>

  const { videoDetails } = response

  return (
    <div className={style["video-details"]}>
      <details open>
        <summary>
          <h2 style={{ display: "inline" }}>動画の情報</h2>
        </summary>
        <table>
          <tbody>
            <tr>
              <td>動画ID</td>
              <td>{videoDetails.videoId}</td>
            </tr>
            <tr>
              <td>タイトル</td>
              <td>{videoDetails.title}</td>
            </tr>
            <tr>
              <td>投稿者</td>
              <td>{videoDetails.author}</td>
            </tr>
            <tr>
              <td>動画時間</td>
              <td>{toDurationString(videoDetails.lengthSeconds)}</td>
            </tr>
          </tbody>
        </table>
        <div className={style["thumbnail-container"]}>
          {videoDetails.thumbnail?.thumbnails && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={style["thumbnail"]}
              src={videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url}
              alt="video thumbnail"
            />
          )}
        </div>
        <details>
          <summary>
            <h3 style={{ display: "inline" }}>技術的情報</h3>
          </summary>
          <div>You can use devtools for more info</div>
          <div>
            endpoint: <code>{"GET /api/video?v={videoId}"}</code>
          </div>
          <textarea readOnly value={JSON.stringify(res, null, 2)} wrap="off"></textarea>
        </details>
      </details>
    </div>
  )
}
