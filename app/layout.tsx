import type { Metadata } from "next"
import "./global.scss"

export const metadata: Metadata = {
  title: "YT Downloader",
  description: "とてもシンプルな、YouTubeのダウンローダー",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
