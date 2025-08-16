import { getPlayerResponse, getWatchPage, PlayerResponse } from "@shiminiku/yt-o"

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:8787" : "https://yt-dp.smnk.workers.dev"

export type GET_watch_resp = Awaited<ReturnType<typeof getWatchPage>>
export type GET_playerResponse_resp = Awaited<ReturnType<typeof getPlayerResponse>>
export type Format = NonNullable<PlayerResponse["streamingData"]>["formats"][number]
export type AdFormat = NonNullable<PlayerResponse["streamingData"]>["adaptiveFormats"][number]

export async function GET_watch(videoId: string) {
  return (await fetch(`${BASE_URL}/watch?v=${videoId}`).then((r) =>
    r.status === 200 ? r.json() : Promise.reject(new Error("returned not 200."))
  )) as GET_watch_resp
}

export async function GET_playerResponse(videoId: string) {
  return (await fetch(`${BASE_URL}/playerResponse?v=${videoId}`).then((r) =>
    r.status === 200 ? r.json() : Promise.reject(new Error("returned not 200."))
  )) as GET_playerResponse_resp
}

export function sigCodeJSsrc(baseJsUrl: string) {
  return `${BASE_URL}/sigCode.js?basejs=${encodeURIComponent(baseJsUrl)}`
}
