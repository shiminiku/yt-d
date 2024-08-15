const BASE_URL = "https://yt-dp.smnk.workers.dev"

export async function GET_playerResponse(videoId: string) {
  return (await fetch(`${BASE_URL}/playerResponse?v=${videoId}`).then((r) =>
    r.status === 200 ? r.json() : Promise.reject(new Error("returned not 200."))
  )) as {
    playerResponse?: any
    basejsURL: string
  }
}

export function sigCodeJSsrc(baseJsUrl: string) {
  return `${BASE_URL}/sigCode.js?basejs=${encodeURIComponent(baseJsUrl)}`
}
