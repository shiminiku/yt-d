import { extractVideoId } from "@shiminiku/yt-o"
import { redirect } from "next/navigation"
import { Metadata } from "next"

import style from "./page.module.scss"

export const metadata: Metadata = {
  title: "Lens - YT Downloader",
  description: "とてもシンプルな、YouTubeの動画情報ビュワー",
  openGraph: {
    type: "website",
    images: "https://yt-d.vercel.app/favicon.ico",
  },
}

export default async function Lens() {
  async function submit(formData: FormData) {
    "use server"
    const url = formData.get("url")
    if (!url || typeof url !== "string") return "Invalid URL"

    const id = extractVideoId(url)
    if (!id) return "video ID not found"

    redirect(`/lens/${id}`)
  }

  return (
    <>
      <main>
        <h1>Lens</h1>

        <form className={style.form} action={submit}>
          <input
            className={style.idInput}
            type="text"
            name="url"
            required
            placeholder="リンク、動画ID (jNQXAC9IVRw, https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
          />
          <button type="submit">OK</button>
        </form>
      </main>
    </>
  )
}
