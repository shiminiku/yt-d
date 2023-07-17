import Head from "next/head"
import Main from "../components/Main"

export default function Index() {
  return (
    <>
      <Head>
        <title>YT Downloader</title>
        <meta name="description" content="とてもシンプルな、YouTubeのダウンローダー" />
        <meta property="og:title" content="YT Downloader" />
        <meta name="og:description" content="とてもシンプルな、YouTubeのダウンローダー" />
        <meta property="og:image" content="https://yt-d.vercel.app/favicon.ico" />

        <link rel="preload" as="image" href="/trouble-yt.svg" />
      </Head>
      <Main />
    </>
  )
}
