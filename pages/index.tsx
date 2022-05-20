import Main from "components/Main"
import Head from "next/head"

export default function Index() {
  return (
    <>
      <Head>
        <title>YT Downloader</title>
        <meta name="description" content="とてもシンプルな、YouTubeのダウンローダー" />
        <meta property="og:title" content="YT Downloader" />
        <meta name="og:description" content="とてもシンプルな、YouTubeのダウンローダー" />
        <meta property="og:image" content="https://yt-d.vercel.app/favicon.ico" />
      </Head>
      <Main />
    </>
  )
}
