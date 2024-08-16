import type { Metadata } from "next"
import "./global.scss"

export const metadata: Metadata = {
  title: "YT Downloader",
  description: "とてもシンプルな、YouTubeのダウンローダー",
  openGraph: {
    type: "website",
    images: "https://yt-d.vercel.app/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
