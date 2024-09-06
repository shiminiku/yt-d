import { useContext } from "react"
import style from "/styles/Helps.module.scss"
import { ShowHelpContext } from "./Contexts"

export interface Help {
  title: string
  body: string[]
}

export const HELPS = {
  mimeType: {
    title: "MIMEタイプ (video,audio/mp4; codecs=...)",
    body: [
      "videoではじまるなら動画、audioなら音声",
      '"video,audio/mp4" の "mp4" はファイル形式,拡張子(コンテナフォーマット)',
      '"codecs=..."の"..."が、"avc1"ではじまるなら H.264、"mp4a"なら AAC、"av01"なら AV1 がコーデックに使われている',
      "(avc1 = Advanced Video Coding, mp4a = mp4 Audio, av01 = AOMedia Video 1)",
      "ほかはそのまま調べれば出てくる",
    ],
  },
  bothFormats: {
    title: "両方 (動画と音声が一体化)",
    body: ["動画と音声が一緒になったファイルです", "ですが画質は最高でも720p30fpsまでです"],
  },
  adaptiveFormats: {
    title: "分割 (動画と音声がそれぞれで分割)",
    body: [
      "動画と音声がそれぞれ別のファイルになります",
      "「両方」とは違いアップロードされた最高画質まであります",
      "個別にダウンロードした後に、別々のファイルを1つにする必要があります",
      "音声だけでいい場合には便利です",
    ],
  },
  downloading: {
    title: "ダウンロード",
    body: [
      "1. ボタンをクリックする: 新しいタブで開くようになっています",
      "2. ダウンロードする: ダウンロードボタンや右クリックから保存します",
      "3. 開いたタブを閉じます: Firefox の場合はこれでダウンロード速度がとても速くなります",
    ],
  },
} satisfies Record<string, Help>

export function HelpButton({ helpKey, children }: { helpKey: keyof typeof HELPS; children: React.ReactNode }) {
  const showHelp = useContext(ShowHelpContext)
  return (
    <button className={style.helpBtn} onClick={() => showHelp?.(HELPS[helpKey])}>
      {children}
    </button>
  )
}
