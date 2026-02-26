import { extractVideoId } from "@shiminiku/yt-o"
import { redirect, RedirectType } from "next/navigation"

export async function submitLens(_: any, formData: FormData) {
  const url = formData.get("url")
  if (!url || typeof url !== "string") return "Invalid URL"

  const id = extractVideoId(url)
  if (!id) return "video ID not found"

  redirect(`/lens/${id}`, RedirectType.push)
}
