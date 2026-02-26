import { Metadata } from "next"
import { LensForm } from "./lensComp"

export const metadata: Metadata = {
  title: "Lens - YT Downloader",
  description: "とてもシンプルな、YouTubeの動画情報ビュワー",
  openGraph: {
    type: "website",
    images: "https://yt-d.vercel.app/favicon.ico",
  },
}

export default async function Lens() {
  return (
    <main>
      <h1>Lens</h1>
      <LensForm />
    </main>
  )
}
