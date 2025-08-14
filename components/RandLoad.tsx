"use client"
import Image from "next/image"
import { useEffect, useState } from "react"

const IMAGES = [
  "audio.svg",
  "ball-triangle.svg",
  "bars.svg",
  "circles.svg",
  "grid.svg",
  "hearts.svg",
  "oval.svg",
  "puff.svg",
  "rings.svg",
  "spinning-circles.svg",
  "tail-spin.svg",
  "three-dots.svg",
]

export default function RandLoading() {
  const [img, setImg] = useState("")
  useEffect(() => {
    setImg("/svg-loaders/" + IMAGES[Math.floor(Math.random() * IMAGES.length)])
  }, [])
  return img ? <Image src={img} alt="ロード中…" width={16} height={16} /> : null
}
