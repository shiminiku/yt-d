"use client"

import Image from "next/image"

import style from "./page.module.scss"
import yt from "/public/trouble-yt.svg"
import RandLoading from "../components/RandLoad"

export type URLCache = Record<string, string>

export default function Home() {
  return (
    <>
      <main className={style.main}>
        <h1>YT Downloader は終了しました</h1>

        <center>
          <Image src={yt} title="かつて読込中に表示されていた画像" alt="かつて読込中に表示されていた画像" />
        </center>

        <p>長らくYouTube動画をダウンロードするツールを作ってきましたが、</p>
        <ol>
          <li>ダウンロード対策の回避が難しい</li>
          <li>開発に飽きた</li>
        </ol>
        <p>この2つの理由から、申し訳ないですがこのツールの提供を終了します。</p>
        <p>これまで使ってくださった方に感謝申し上げます。ありがとうございました。</p>
        <p>最近はあまり動画をダウンロードしないですが、ダウンロードするときはyt-dlpを使っています。</p>
        <p>これを皆さんにもおすすめします。yt-dlp、偉大</p>

        <p>
          Thanks for using this tool! <RandLoading />
          <RandLoading />
          <RandLoading />
        </p>
      </main>

      <footer className={style.footer + " full"}>
        <p>
          GitHub <a href="https://github.com/shiminiku/yt-d">shiminiku/yt-d</a>・Loading Icon{" "}
          <a href="https://github.com/SamHerbert/SVG-Loaders">SVG-Loaders</a>
        </p>
      </footer>
    </>
  )
}
