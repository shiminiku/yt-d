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

// TODO: add filter (like yt-da)
export function VideoDetails({ videoDetails }: { videoDetails: any }) {
  return (
    <div className={style["video-details"]}>
      {videoDetails && (
        <details open>
          <summary>
            <h2 style={{ display: "inline" }}>動画の情報</h2>
          </summary>
          <table>
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
              <h3 className="gray-out" style={{ display: "inline" }}>
                技術的情報について
              </h3>
            </summary>
            <p>生のレスポンスは、DevToolsのネットワークタブから観察できますよ。兄さんや</p>
            <p>URLのパターンはこんな感じ:</p>
            <p>
              <code className="code">{"<...>/watch?v={videoId}"}</code>
            </p>
          </details>
        </details>
      )}
    </div>
  )
}
