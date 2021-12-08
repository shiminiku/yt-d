import style from "styles/style.module.scss"

export function VideoDetailsTable({ videoDetails }) {
  return (
    <table className={style["table-details"]}>
      <tbody>
        <tr>
          <th>videoId</th>
        </tr>
        <tr>
          <td>{videoDetails.videoId ?? <span className={style["gray-text"]}>-----</span>}</td>
        </tr>
        <tr>
          <th>タイトル</th>
        </tr>
        <tr>
          <td>{videoDetails.title ?? <span className={style["gray-text"]}>-----</span>}</td>
        </tr>
        <tr>
          <th>投稿者</th>
        </tr>
        <tr>
          <td>{videoDetails.author ?? <span className={style["gray-text"]}>-----</span>}</td>
        </tr>
        <tr>
          <th>サムネイル</th>
        </tr>
        <tr>
          <td>
            {videoDetails.thumbnail?.thumbnails ? (
              <img
                className={style["thumbnail"]}
                src={videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url}
              />
            ) : (
              <span className={style["gray-text"]}>-----</span>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
