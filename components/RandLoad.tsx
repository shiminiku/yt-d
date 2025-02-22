import Image from "next/image"

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
  return (
    <Image
      src={"/svg-loaders/" + IMAGES[Math.floor(Math.random() * IMAGES.length)]}
      alt="ロード中…"
      width={16}
      height={16}
    />
  )
}
